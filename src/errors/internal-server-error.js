import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Внутренняя ошибка сервера" (Internal Server Error),
 * расширяющий класс HttpError. Предназначен для обработки ситуаций, когда
 * сервер не смог обработать запрос по внутренней причине.
 * Статус ошибки соответствует HTTP-коду 500.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.INTERNAL_SERVER_ERROR} - Тип ошибки, передаваемый в конструктор
 */
export default class InternalServerError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Внутренняя ошибка сервера".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Internal Server Error"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(500, details, {
      type: ERROR_TYPE.INTERNAL_SERVER_ERROR,
      message,
      cause,
    })

    this.name = 'InternalServerError'
  }
}
