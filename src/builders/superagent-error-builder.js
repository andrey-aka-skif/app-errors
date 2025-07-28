import DisconnectedError from '../disconnected-error'
import BadRequestError from '../bad-request-error'
import UnauthorizedError from '../unauthorized-error'
import ForbiddenError from '../forbidden-error'
import NotFoundError from '../not-found-error'
import ConflictError from '../conflict-error'
import InternalServerError from '../internal-server-error'
import UnknownError from '../unknown-error'

/**
 * Проверка на возможную ошибку приложения.
 * @param {*} response
 * @description При разборе ответа сервера может возникнуть исключение,
 * не связанное напрямую с ошибочным ответом сервера.
 * Например, при использовании связки Superagent + OpenApi Middleware
 * возникает исключение при некоторых ответах (202  Accepted, 208  AlreadyReported, etc).
 * Middleware ожидает ответ определенного формата.
 * При неожиданном формате возникает исключение "data.map is not a function".
 * При таком исключении в нем отсутствует свойство "error"
 * @param {*} response - Ответ, который нужно проверить
 * @returns {boolean} true, если ответ не содержит свойства "error", иначе false
 */
const isMaybeError = response => {
  return !('error' in response)
}

/**
 * Проверяет, содержит ли ошибка ответ от сервера.
 * @description При недоступности сервера в исключении,
 * формируемом Superagent, отсутствуют свойства "body", "response" и "statusText"
 * @param {*} error - Объект ошибки для проверки
 * @returns {boolean} true, если ошибка содержит серверный ответ, иначе false
 */
const isDisconnect = error => {
  return !('body' in error && 'response' in error && 'statusText' in error)
}

/**
 * Получена ошибка, сформированная сервером
 * @param {*} error
 * @returns true или false
 * @description Считаем признаком получения ошибки от сервера
 * наличие свойства "response"
 */
const hasServerError = error => {
  return 'response' in error
}

/**
 * Пытается извлечь значение свойства "detail" из ответа сервера.
 * Проверяет несколько вариантов доступа к данным: "body.detail", "body.Detail", "body".
 * @param {*} response - Ответ сервера
 * @returns {*} Значение "detail", если оно существует, иначе null
 */
const tryGetDetail = response => {
  return (
    response?.body?.detail ?? response?.body?.Detail ?? response?.body ?? null
  )
}

/**
 * Преобразует серверную ошибку в соответствующий класс ошибки.
 * Сопоставляет статус-код ответа с конкретным типом ошибки.
 * @param {*} error - Объект ошибки с серверным ответом
 * @returns {BaseAppError} Экземпляр соответствующего класса ошибки
 */
const getServerError = error => {
  const detail = tryGetDetail(error.response)

  switch (error.response.status) {
    case 400:
      return new BadRequestError(detail)
    case 401:
      return new UnauthorizedError(detail)
    case 403:
      return new ForbiddenError(detail)
    case 404:
      return new NotFoundError(detail)
    case 409:
      return new ConflictError(detail)
    case 500:
      return new InternalServerError()
    default:
      return new UnknownError()
  }
}

/**
 * Основная функция преобразования ошибок Superagent в стандартные ошибки приложения.
 * Выполняет последовательную проверку типов ошибок:
 * 1. Потенциальная неожиданная ошибка (isMaybeError)
 * 2. Потеря соединения (isDisconnect)
 * 3. Серверная ошибка (hasServerError)
 * Возвращает соответствующий класс ошибки на основе результатов проверок.
 * @param {*} error - Исходная ошибка от Superagent
 * @returns {BaseAppError} Экземпляр одного из классов ошибок
 */
export const fromSuperagent = error => {
  if (isMaybeError(error)) {
    return new UnknownError()
  }

  if (isDisconnect(error)) {
    return new DisconnectedError()
  }

  if (hasServerError(error)) {
    return getServerError(error)
  }

  return new UnknownError()
}
