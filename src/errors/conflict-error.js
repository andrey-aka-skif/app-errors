import BaseAppError from '../base-app-error'
import ERROR_TYPE from '../error-type'

/**
 * Класс ошибки "Конфликт" (Conflict), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда запрос не может быть выполнен из-за конфликта с текущим состоянием системы.
 * Статус ошибки соответствует HTTP-коду 409.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.CONFLICT} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class ConflictError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.CONFLICT, ERROR_TYPE.CONFLICT, details)
    this.status = 409
  }
}
