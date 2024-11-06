import { ErrorTypes } from "./errorTypes"
import { AppError } from "./appError"

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
