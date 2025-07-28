import BaseAppError from '../base-app-error'
import ERROR_TYPE from '../error-type'

/**
 * Класс ошибки "Ресурс не найден" (Not Found), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда запрашиваемый ресурс отсутствует.
 * Статус ошибки соответствует HTTP-коду 404.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.NOTFOUND} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class NotFoundError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.NOTFOUND, ERROR_TYPE.NOTFOUND, details)
    this.status = 404
  }
}
