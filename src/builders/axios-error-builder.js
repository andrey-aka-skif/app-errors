import DisconnectedError from '../errors/disconnected-error'
import BadRequestError from '../errors/bad-request-error'
import UnauthorizedError from '../errors/unauthorized-error'
import ForbiddenError from '../errors/forbidden-error'
import NotFoundError from '../errors/not-found-error'
import ConflictError from '../errors/conflict-error'
import InternalServerError from '../errors/internal-server-error'
import UnknownError from '../errors/unknown-error'

/**
 * Попробовать получить значения для свойства "detail" из ответа сервера.
 * Проверяет несколько вариантов доступа к данным: "data.detail", "data.Detail", "data".
 * @param {*} response - Ответ сервера
 * @returns {*} Значение "detail", если оно существует, иначе null
 */
const tryGetDetail = response => {
  return (
    response?.data?.detail ?? response?.data?.Detail ?? response?.data ?? null
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
 * Основная функция преобразования ошибок Axios в стандартные ошибки приложения.
 * Выполняет последовательную проверку типов ошибок:
 * 1. Проверка, является ли ошибка Axios (error.isAxiosError)
 * 2. Наличие ответа от сервера (error.response)
 * 3. Наличие запроса без ответа (error.request)
 * Возвращает соответствующий класс ошибки на основе результатов проверок.
 * @param {*} error - Исходная ошибка от Axios
 * @returns {BaseAppError} Экземпляр одного из классов ошибок
 */
export const fromAxios = error => {
  if (!error.isAxiosError) {
    return new UnknownError()
  }

  if (error.response) {
    return getServerError(error)
  }

  if (error.request) {
    return new DisconnectedError()
  }

  return new UnknownError()
}
