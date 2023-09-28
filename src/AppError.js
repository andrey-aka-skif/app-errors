/**
 * Типы ошибок API
 */
const ErrorTypes = {
    /**
     * Неизвестная ошиибка
     */
    UNKNOWN: 'unknown',
    /**
     * Сервер недоступен
     */
    DISCONNECTED: 'disconnected',
    /**
     * 400
     */
    BADREQUEST: 'badrequest',
    /**
     * 404
     */
    NOTFOUND: 'notfound',
    /**
     * 409
     */
    CONFLICT: 'conflict',
}

/**
 * Объект ошибки приложения
 */
class AppError {
    #DEFAULT_MESSAGE = 'Неизвестная ошибка'
    #DEFAULT_NOT_FOUND_MESSAGE = 'Ресурс не найден'
    #DEFAULT_CONFLICT_MESSAGE = 'Ресурс ранее уже был добавлен'

    type = ErrorTypes.UNKNOWN
    message = this.#DEFAULT_MESSAGE

    /**
     * Объект ошибки, которую вернул API
     * @param {*} runtimeError 
     */
    constructor(runtimeError = null) {
        if (runtimeError)
            this.parse(runtimeError)
    }

    parse(error) {
        if (!error.response) {
            this.type = ErrorTypes.DISCONNECTED
            this.message = 'Сервер недоступен'
            return
        }

        if (!error.status)
            return

        switch (error.status) {
            case 400:
                this.type = ErrorTypes.BADREQUEST
                this.message = this.requestToMessage(error)
                    ?? this.#DEFAULT_MESSAGE
                break
            case 404:
                this.type = ErrorTypes.NOTFOUND
                this.message = this.requestToMessage(error)
                    ?? this.#DEFAULT_NOT_FOUND_MESSAGE
                break
            case 409:
                this.type = ErrorTypes.CONFLICT
                this.message = this.requestToMessage(error)
                    ?? this.#DEFAULT_CONFLICT_MESSAGE
                break
            default:
                break
        }
    }

    requestToMessage(error) {
        if (typeof error.body === "string") {
            return error.body
        }
    }
}

export default AppError
