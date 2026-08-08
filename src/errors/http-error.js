import BaseAppError from '../base-app-error.js'
import ERROR_TYPE from '../error-type.js'
import { reasonPhrase } from '../http-reason-phrase.js'

/**
 * Класс ошибки ответа сервера, расширяющий базовый класс BaseAppError.
 * Хранит HTTP-статус ответа в свойстве status.
 *
 * Головной класс семейства: от него наследуются классы конкретных статусов.
 * Создаётся напрямую, когда для статуса нет отдельного класса, — так статус
 * и тело ответа сохраняются для любого ответа сервера, а не только для
 * заранее перечисленных статусов.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.HTTP} - Тип ошибки по умолчанию
 */
export default class HttpError extends BaseAppError {
  /**
   * Создаёт экземпляр ошибки ответа сервера.
   *
   * @constructor
   * @param {number} status - HTTP-статус ответа
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.type=ERROR_TYPE.HTTP] - Тип ошибки; задаётся классами-наследниками
   * @param {string} [options.message] - Сообщение; по умолчанию причинная фраза статуса
   * @param {*} [options.cause] - Исходная ошибка HTTP-библиотеки
   */
  constructor(status, details = null, { type, message, cause } = {}) {
    super(type ?? ERROR_TYPE.HTTP, message ?? reasonPhrase(status), details, {
      cause,
    })

    this.name = 'HttpError'
    this.status = status
  }
}
