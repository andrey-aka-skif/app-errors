import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

const DEFAULT_MESSAGE = 'Request Timeout'

/**
 * Класс ошибки истечения времени ожидания, расширяющий базовый класс
 * BaseAppError. Предназначен для обработки ситуаций, когда ответ сервера
 * не получен за отведённое время.
 *
 * Отделён от DisconnectedError, потому что решения по повтору запроса
 * у таймаута и у обрыва связи разные. Статуса не имеет — ответа сервера нет.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.TIMEOUT} - Тип ошибки, передаваемый в конструктор
 */
export default class TimeoutError extends BaseAppError {
  /**
   * Создаёт экземпляр ошибки истечения времени ожидания.
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Request Timeout"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(ERROR_TYPE.TIMEOUT, message ?? DEFAULT_MESSAGE, details, { cause })
    this.name = 'TimeoutError'
  }
}
