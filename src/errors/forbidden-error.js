import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

/**
 * Класс ошибки "Доступ запрещён" (Forbidden), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда пользователь авторизован, но не имеет прав на выполнение действия.
 * Тип и сообщение ошибки соответствуют значению `ERROR_TYPE.FORBIDDEN`.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.FORBIDDEN} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class ForbiddenError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.FORBIDDEN, ERROR_TYPE.FORBIDDEN, details)
    this.name = 'ForbiddenError'
    this.status = 403
  }
}
