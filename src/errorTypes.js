/**
 * Типы ошибок
 */
export const ErrorTypes = {
  /**
   * Неизвестная ошиибка
   */
  UNKNOWN: 'Unknown',
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
