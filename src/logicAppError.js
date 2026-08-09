import { ErrorTypes } from './errorTypes.js'
import { AppError } from './AppError.js'

/**
 * Объект ошибки приложения, представляющий ошибки уровня логики приложения
 */
export class LogicAppError extends AppError {
  constructor(message, detail = null) {
    super(message)
    this.name = 'LogicAppError'
    this.type = ErrorTypes.LOGIC
    this.detail = detail
  }
}
