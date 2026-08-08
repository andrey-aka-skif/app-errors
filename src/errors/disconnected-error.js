import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'

const DEFAULT_MESSAGE = 'Connection Failed'

/**
 * Класс ошибки, связанной с потерей соединения, расширяющий базовый класс
 * BaseAppError. Предназначен для обработки ситуаций, когда приложение теряет
 * связь с внешними ресурсами.
 *
 * Наследуется от BaseAppError, а не от HttpError: ответа сервера нет,
 * а значит нет и статуса.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.DISCONNECTED} - Тип ошибки, передаваемый в конструктор
 */
export default class DisconnectedError extends BaseAppError {
  /**
   * Создаёт экземпляр ошибки потери соединения.
   *
   * @constructor
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Connection Failed"
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(details = null, { message, cause } = {}) {
    super(ERROR_TYPE.DISCONNECTED, message ?? DEFAULT_MESSAGE, details, {
      cause,
    })

    this.name = 'DisconnectedError'
  }
}
