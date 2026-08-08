import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

const DEFAULT_MESSAGE = 'Unknown Error'

/**
 * Класс ошибки "Неизвестная ошибка" (Unknown Error), расширяющий базовый класс
 * BaseAppError. Предназначен для обработки ситуаций, когда тип ошибки
 * не может быть определён или является неожиданным.
 *
 * Принимает детали и исходную ошибку: билдеры передают причину на каждой
 * ветке, включая ветку неопознанной ошибки.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.UNKNOWN} - Тип ошибки, передаваемый в конструктор
 */
export default class UnknownError extends BaseAppError {
  /**
   * Создаёт экземпляр неизвестной ошибки.
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Unknown Error"
   * @param {*} [options.cause] - Исходная ошибка
   */
  constructor(details = null, { message, cause } = {}) {
    super(ERROR_TYPE.UNKNOWN, message ?? DEFAULT_MESSAGE, details, { cause })
    this.name = 'UnknownError'
  }
}
