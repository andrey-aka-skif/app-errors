import ERROR_TYPE from './error-type.js'

const DEFAULT_TYPE = ERROR_TYPE.UNKNOWN
const DEFAULT_MESSAGE = ''
const DEFAULT_DETAILS = null

/**
 * Базовый класс для ошибок приложения, расширяющий встроенный класс Error.
 * Добавляет пользовательские свойства: тип ошибки и дополнительные детали.
 * Исходная ошибка передаётся штатным механизмом Error — options.cause.
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
   * @param {*} [details=DEFAULT_DETAILS] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {*} [options.cause] - Исходная ошибка, ставшая причиной этой
   * @see {@link Error} - Встроенный класс JavaScript, от которого наследуется
   * @throws {Error} Выбрасывает ошибку, если класс используется напрямую
   */
  constructor(
    type = DEFAULT_TYPE,
    message = DEFAULT_MESSAGE,
    details = DEFAULT_DETAILS,
    { cause } = {}
  ) {
    if (new.target === BaseAppError) {
      throw new Error('Экземпляр класса не должен быть создан напрямую')
    }

    // Опции передаются только при заданной причине. Error устанавливает
    // собственное свойство cause при одном лишь наличии ключа в объекте
    // опций, независимо от значения, поэтому super(message, { cause:
    // undefined }) добавил бы каждой ошибке свойство cause со значением
    // undefined — видимое и в логах, и в любом сериализаторе.
    super(message, cause === undefined ? undefined : { cause })

    this.type = type
    this.details = details
  }
}
