import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Некорректный запрос" (Bad Request), расширяющий класс HttpError.
 * Предназначен для обработки ситуаций, когда запрос составлен неверно.
 * Статус ошибки соответствует HTTP-коду 400.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.BAD_REQUEST} - Тип ошибки, передаваемый в конструктор
 */
export default class BadRequestError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Некорректный запрос".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Bad Request"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(400, details, { type: ERROR_TYPE.BAD_REQUEST, message, cause })
    this.name = 'BadRequestError'
  }
}
