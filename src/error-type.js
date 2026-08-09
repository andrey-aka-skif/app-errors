/**
 * Типы ошибок.
 *
 * Ключ — идентификатор в коде, значение — машинный токен, попадающий
 * в сериализацию. Тип — единственный сериализуемый дискриминатор ошибки:
 * ветвление строится по нему, а не по сообщению, которое человекочитаемо
 * и может быть переопределено вызывающей стороной.
 *
 * Значения токенов входят в формат хранения, поэтому меняются только вместе
 * с мажорной версией пакета.
 */
const ERROR_TYPE = Object.freeze({
  /**
   * Неизвестная ошибка
   */
  UNKNOWN: 'Unknown',
  /**
   * Ошибка логики приложения
   */
  LOGIC: 'Logic',
  /**
   * Сервер недоступен
   */
  DISCONNECTED: 'Disconnected',
  /**
   * Истекло время ожидания ответа
   */
  TIMEOUT: 'Timeout',
  /**
   * Запрос отменён вызывающей стороной
   */
  CANCELED: 'Canceled',
  /**
   * Ответ сервера со статусом, для которого нет отдельного класса
   */
  HTTP: 'Http',
  /**
   * 400 Bad Request
   */
  BAD_REQUEST: 'BadRequest',
  /**
   * 401 Unauthorized
   */
  UNAUTHORIZED: 'Unauthorized',
  /**
   * 403 Forbidden
   */
  FORBIDDEN: 'Forbidden',
  /**
   * 404 Not Found
   */
  NOT_FOUND: 'NotFound',
  /**
   * 409 Conflict
   */
  CONFLICT: 'Conflict',
  /**
   * 422 Unprocessable Entity
   */
  UNPROCESSABLE_ENTITY: 'UnprocessableEntity',
  /**
   * 429 Too Many Requests
   */
  TOO_MANY_REQUESTS: 'TooManyRequests',
  /**
   * 500 Internal Server Error
   */
  INTERNAL_SERVER_ERROR: 'InternalServerError',
})

export default ERROR_TYPE
