import { ErrorTypes } from './errorTypes'

/**
 * Базовый объект ошибки приложения
 */
export class AppError extends Error {
  constructor(message = '', detail = null) {
    super(message)
    this.name = 'AppError'
    this.type = ErrorTypes.UNKNOWN
    this.detail = detail
  }
}
