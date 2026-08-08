import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Не авторизован" (Unauthorized), расширяющий класс HttpError.
 * Предназначен для обработки ситуаций, когда запрос требует аутентификации.
 * Статус ошибки соответствует HTTP-коду 401.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.UNAUTHORIZED} - Тип ошибки, передаваемый в конструктор
 */
export default class UnauthorizedError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Не авторизован".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Unauthorized"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(401, details, { type: ERROR_TYPE.UNAUTHORIZED, message, cause })
    this.name = 'UnauthorizedError'
  }
}
