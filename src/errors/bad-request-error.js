import BaseAppError from './base-app-error'
import ERROR_TYPE from './error-type'

/**
 * Класс ошибки "Неверный запрос" (Bad Request), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда клиент отправляет некорректные данные.
 * Статус ошибки соответствует HTTP-коду 400.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.BADREQUEST} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class BadRequestError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.BADREQUEST, ERROR_TYPE.BADREQUEST, details)
    this.status = 400
  }
}
