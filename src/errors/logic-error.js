import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

/**
 * Класс ошибки логики приложения, расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ошибок, связанных с логическими нарушениями в работе приложения.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.LOGIC} - Тип ошибки, передаваемый в конструктор
 */
export default class LogicError extends BaseAppError {
  constructor(message, details = null) {
    super(ERROR_TYPE.LOGIC, message, details)
    this.name = 'LogicError'
  }
}
