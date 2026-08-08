import ERROR_TYPE from '../error-type.js'
import HttpError from './http-error.js'

/**
 * Класс ошибки "Необрабатываемая сущность" (Unprocessable Entity),
 * расширяющий класс HttpError. Предназначен для обработки ситуаций, когда
 * запрос синтаксически верен, но не проходит проверку значений.
 * Статус ошибки соответствует HTTP-коду 422.
 *
 * @class
 * @extends HttpError
 * @see {@link HttpError} - Головной класс семейства ошибок ответа сервера
 * @see {@link ERROR_TYPE.UNPROCESSABLE_ENTITY} - Тип ошибки, передаваемый в конструктор
 */
export default class UnprocessableEntityError extends HttpError {
  /**
   * Создаёт экземпляр ошибки "Необрабатываемая сущность".
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Unprocessable Entity"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(422, details, {
      type: ERROR_TYPE.UNPROCESSABLE_ENTITY,
      message,
      cause,
    })

    this.name = 'UnprocessableEntityError'
  }
}
