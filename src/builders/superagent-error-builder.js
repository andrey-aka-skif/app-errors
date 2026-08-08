import DisconnectedError from '../errors/disconnected-error.js'
import BadRequestError from '../errors/bad-request-error.js'
import UnauthorizedError from '../errors/unauthorized-error.js'
import ForbiddenError from '../errors/forbidden-error.js'
import NotFoundError from '../errors/not-found-error.js'
import ConflictError from '../errors/conflict-error.js'
import InternalServerError from '../errors/internal-server-error.js'
import UnknownError from '../errors/unknown-error.js'

/**
 * Пригоден ли аргумент для разбора.
 * @description Отсеивает null, undefined и примитивы: обращение к их
 * свойствам либо выбрасывает TypeError, либо не имеет смысла.
 * @param {*} error - Значение, переданное в билдер
 * @returns {boolean} true, если значение можно разбирать
 */
const isParsable = error => {
  return typeof error === 'object' && error !== null
}

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
      return new InternalServerError(detail)
    default:
      return new UnknownError()
  }
}

/**
 * Основная функция преобразования ошибок Superagent в стандартные ошибки приложения.
 * Выполняет последовательную проверку типов ошибок:
 * 1. Пригодность аргумента для разбора
 * 2. Потенциальная неожиданная ошибка (isMaybeError)
 * 3. Потеря соединения (isDisconnect)
 * Всё, что прошло эти проверки, содержит ответ сервера.
 * Никогда не выбрасывает исключение: функция вызывается в catch-блоках,
 * где собственное падение скрыло бы исходную ошибку.
 * @param {*} error - Исходная ошибка от Superagent
 * @returns {BaseAppError} Экземпляр одного из классов ошибок
 */
export const fromSuperagent = error => {
  if (!isParsable(error)) {
    return new UnknownError()
  }

  if (isMaybeError(error)) {
    return new UnknownError()
  }

  if (isDisconnect(error)) {
    return new DisconnectedError()
  }

  return getServerError(error)
}
