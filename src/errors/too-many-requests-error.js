import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Слишком много запросов" (Too Many Requests), расширяющий
 * класс HttpError. Предназначен для обработки ситуаций, когда сервер
 * ограничивает частоту обращений.
 * Статус ошибки соответствует HTTP-коду 429.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.TOO_MANY_REQUESTS} - Тип ошибки, передаваемый в конструктор
 */
export default class TooManyRequestsError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Слишком много запросов".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Too Many Requests"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(429, details, { type: ERROR_TYPE.TOO_MANY_REQUESTS, message, cause })
    this.name = 'TooManyRequestsError'
  }
}
