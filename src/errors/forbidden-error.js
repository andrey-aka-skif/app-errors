import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Доступ запрещён" (Forbidden), расширяющий класс HttpError.
 * Предназначен для обработки ситуаций, когда доступ к ресурсу запрещён.
 * Статус ошибки соответствует HTTP-коду 403.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.FORBIDDEN} - Тип ошибки, передаваемый в конструктор
 */
export default class ForbiddenError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Доступ запрещён".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Forbidden"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(403, details, { type: ERROR_TYPE.FORBIDDEN, message, cause })
    this.name = 'ForbiddenError'
  }
}
