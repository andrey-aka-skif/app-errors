import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

const DEFAULT_MESSAGE = 'Request Canceled'

/**
 * Класс ошибки отменённого запроса, расширяющий базовый класс BaseAppError.
 * Предназначен для обработки ситуаций, когда запрос отменён вызывающей
 * стороной, а не сорван сетью или сервером.
 *
 * Отделён от прочих ошибок, потому что отмена — штатное событие: её обычно
 * не нужно ни показывать пользователю, ни повторять. Статуса не имеет —
 * ответа сервера нет.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.CANCELED} - Тип ошибки, передаваемый в конструктор
 */
export default class CanceledError extends BaseAppError {
  /**
   * Создаёт экземпляр ошибки отменённого запроса.
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Request Canceled"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(ERROR_TYPE.CANCELED, message ?? DEFAULT_MESSAGE, details, { cause })
    this.name = 'CanceledError'
  }
}
