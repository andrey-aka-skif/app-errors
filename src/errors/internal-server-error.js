import BaseAppError from './base-app-error'
import ERROR_TYPE from './error-type'

/**
 * Класс ошибки "Внутренняя ошибка сервера" (Internal Server Error), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда сервер столкнулся с непредвиденной ошибкой, препятствующей выполнению запроса.
 * Статус ошибки соответствует HTTP-коду 500.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.INTERNALSERVERERROR} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class InternalServerError extends BaseAppError {
  constructor(details = null) {
    super(
      ERROR_TYPE.INTERNALSERVERERROR,
      ERROR_TYPE.INTERNALSERVERERROR,
      details
    )
    this.status = 500
  }
}
