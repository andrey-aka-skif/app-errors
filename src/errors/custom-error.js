import BaseAppError from '../base-app-error'
import ERROR_TYPE from '../error-type'

/**
 * Класс пользовательской ошибки, расширяющий базовый класс BaseAppError.
 * Позволяет создавать ошибки с произвольным типом, сообщением и дополнительными деталями.
 *
 * @class
 * @extends BaseAppError
 * @see {@link BaseAppError} - Базовый класс для всех ошибок приложения
 * @see {@link ERROR_TYPE.CUSTOM} - Значение по умолчанию для сообщения ошибки
 */
export default class CustomError extends BaseAppError {
  /**
   * Создаёт экземпляр пользовательской ошибки.
   *
   * @constructor
   * @param {string} type - Тип ошибки (обязательный параметр)
   * @param {string} [message=ERROR_TYPE.CUSTOM] - Сообщение об ошибке (по умолчанию ERROR_TYPE.CUSTOM)
   * @param {Object} [details=null] - Дополнительные детали ошибки (по умолчанию null)
   * @see {@link BaseAppError.constructor} - Конструктор базового класса
   * @example
   * // Создание ошибки с кастомным типом и сообщением
   * const error = new CustomError('INVALID_INPUT', 'Некорректный ввод данных');
   *
   * // Создание ошибки с кастомным типом и деталями
   * const errorWithDetails = new CustomError('PERMISSION_DENIED', undefined, { code: 403 });
   */
  constructor(type, message = ERROR_TYPE.CUSTOM, details = null) {
    super(type, message, details)
  }
}
