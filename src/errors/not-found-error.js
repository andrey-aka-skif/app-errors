import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Ресурс не найден" (Not Found), расширяющий класс HttpError.
 * Предназначен для обработки ситуаций, когда запрашиваемый ресурс отсутствует.
 * Статус ошибки соответствует HTTP-коду 404.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.NOT_FOUND} - Тип ошибки, передаваемый в конструктор
 */
export default class NotFoundError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Ресурс не найден".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Not Found"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(404, details, { type: ERROR_TYPE.NOT_FOUND, message, cause })
    this.name = 'NotFoundError'
  }
}
