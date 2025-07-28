/**
 * Типы ошибок
 */
const ERROR_TYPE = {
  /**
   * Неизвестная ошиибка
   */
  UNKNOWN: 'Unknown',
  /**
   * Пользовательская ошибка
   */
  CUSTOM: 'Custom',
  /**
   * Сервер недоступен
   */
  DISCONNECTED: 'Disconnected',
  /**
   * 400 Bad Request
   */
  BADREQUEST: 'BadRequest',
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
  NOTFOUND: 'NotFound',
  /**
   * 409 Conflict
   */
  CONFLICT: 'Conflict',
  /**
   * 500 Internal Server Error
   */
  INTERNALSERVERERROR: 'InternalServerError',
  /**
   * Ошибка логики приложения
   */
  LOGIC: 'Logic',
}

export default ERROR_TYPE
