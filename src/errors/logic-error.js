import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'
import { assertRequiredString } from '../assert-required-string.js'

/**
 * Класс ошибки логики приложения, расширяющий базовый класс BaseAppError.
 * Обозначает нарушенное прикладное правило или инвариант — ожидаемую ситуацию,
 * а не дефект в коде.
 *
 * Единственный класс, который не порождают билдеры: его создаёт само
 * приложение там, где правило проверено. Тип зашит и вызывающей стороне
 * не подчиняется, поэтому всё, что уточняет ошибку, включая собственную
 * классификацию приложения, кладётся в details.
 *
 * Единственный класс без сообщения по умолчанию: осмысленный текст здесь
 * может задать только вызывающая сторона.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.LOGIC} - Тип ошибки, передаваемый в конструктор
 */
export default class LogicError extends BaseAppError {
  /**
   * Создаёт экземпляр ошибки логики приложения.
   *
   * @constructor
   * @param {string} message - Сообщение; обязательный непустой строковый параметр
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {*} [options.cause] - Исходная ошибка
   * @throws {TypeError} Если сообщение не задано или не является непустой строкой
   */
  constructor(message, details = null, { cause } = {}) {
    assertRequiredString(message, 'LogicError', 'message')

    super(ERROR_TYPE.LOGIC, message, details, { cause })
    this.name = 'LogicError'
  }
}
