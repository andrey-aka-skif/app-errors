import BaseAppError from './base-app-error'
import ERROR_TYPE from './error-type'

/**
 * Класс ошибки "Доступ запрещён" (Unauthorized), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда пользователь не авторизован или у него отсутствуют права доступа.
 * Тип и сообщение ошибки соответствуют значению `ERROR_TYPE.UNAUTHORIZED`.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.UNAUTHORIZED} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class UnauthorizedError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.UNAUTHORIZED, ERROR_TYPE.UNAUTHORIZED, details)
    this.status = 401
  }
}
