import ERROR_TYPE from './error-type'

const DEFAULT_TYPE = ERROR_TYPE.UNKNOWN
const DEFAULT_MESSAGE = ''
const DEFAULT_DETAIL = null

/**
 * Базовый класс для ошибок приложения, расширяющий встроенный класс Error.
 * Добавляет пользовательские свойства: тип ошибки и дополнительные детали.
 * Класс не должен быть создан напрямую.
 *
 * @class
 * @abstract
 * @extends Error
 */
export default class BaseAppError extends Error {
  /**
   * Создаёт экземпляр базовой ошибки приложения.
   *
   * @constructor
   * @param {string} [type=DEFAULT_TYPE] - Тип ошибки (по умолчанию UNKNOWN)
   * @param {string} [message=DEFAULT_MESSAGE] - Сообщение об ошибке (по умолчанию пустая строка)
   * @param {Object} [details=DEFAULT_DETAIL] - Дополнительные детали ошибки (по умолчанию null)
   * @see {@link Error} - Встроенный класс JavaScript, от которого наследуется
   * @throws {Error} Выбрасывает ошибку, если класс используется напрямую
   */
  constructor(
    type = DEFAULT_TYPE,
    message = DEFAULT_MESSAGE,
    details = DEFAULT_DETAIL
  ) {
    if (new.target === BaseAppError) {
      throw new Error('Экземпляр класса не должен быть создан напрямую')
    }

    super(message)
    this.type = type
    this.details = details
  }
}
