import BaseAppError from '../base-app-error.js'
import { assertRequiredString } from '../assert-required-string.js'

const DEFAULT_MESSAGE = 'Custom Error'

/**
 * Класс пользовательской ошибки, расширяющий базовый класс BaseAppError.
 * Позволяет создавать ошибки с произвольным типом, сообщением
 * и дополнительными деталями.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 */
export default class CustomError extends BaseAppError {
  /**
   * Создаёт экземпляр пользовательской ошибки.
   *
   * @constructor
   * @param {string} type - Тип ошибки; обязательный непустой строковый параметр
   * @param {*} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @param {Object} [options={}] - Необязательные параметры
   * @param {string} [options.message] - Сообщение; по умолчанию "Custom Error"
   * @param {*} [options.cause] - Исходная ошибка
   * @throws {TypeError} Если тип не задан или не является непустой строкой
   * @example
   * // Создание ошибки с кастомным типом и сообщением
   * const error = new CustomError('INVALID_INPUT', null, {
   *   message: 'Некорректный ввод данных',
   * })
   *
   * // Создание ошибки с кастомным типом и деталями
   * const withDetails = new CustomError('PERMISSION_DENIED', { code: 403 })
   */
  constructor(type, details = null, { message, cause } = {}) {
    // Проверка до super(): обращения к this здесь нет, а падать лучше
    // до того, как объект ошибки будет создан наполовину.
    assertRequiredString(type, 'CustomError', 'type')

    super(type, message ?? DEFAULT_MESSAGE, details, { cause })
    this.name = 'CustomError'
  }
}
