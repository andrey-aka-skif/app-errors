import BaseAppError from '../base-app-error'
import ERROR_TYPE from '../error-type'

/**
 * Класс ошибки "Неизвестная ошибка" (Unknown Error), расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда тип ошибки не может быть определён или является неожиданным.
 * Тип и сообщение ошибки соответствуют значению `ERROR_TYPE.UNKNOWN`, дополнительные детали устанавливаются в null.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.UNKNOWN} - Тип ошибки и сообщение, передаваемые в конструктор
 */
export default class UnknownError extends BaseAppError {
  constructor() {
    super(ERROR_TYPE.UNKNOWN, ERROR_TYPE.UNKNOWN, null)
  }
}
