import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Конфликт" (Conflict), расширяющий класс HttpError.
 * Предназначен для обработки ситуаций, когда запрос конфликтует
 * с текущим состоянием ресурса.
 * Статус ошибки соответствует HTTP-коду 409.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.CONFLICT} - Тип ошибки, передаваемый в конструктор
 */
export default class ConflictError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Конфликт".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Conflict"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(409, details, { type: ERROR_TYPE.CONFLICT, message, cause })
    this.name = 'ConflictError'
  }
}
