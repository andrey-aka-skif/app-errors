import BaseAppError from './base-app-error'
import ERROR_TYPE from './error-type'

/**
 * Класс ошибки, связанной с потерей соединения, расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда приложение теряет связь с внешними ресурсами.
 * Сообщение ошибки совпадает с типом ошибки.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.DISCONNECTED} - Тип ошибки, передаваемый в конструктор
 */
export default class DisconnectedError extends BaseAppError {
  constructor(details = null) {
    super(ERROR_TYPE.DISCONNECTED, ERROR_TYPE.DISCONNECTED, details)
  }
}
