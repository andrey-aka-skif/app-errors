import { ERROR_TYPE } from "./error-type"
import { AppError } from "./base-app-error"

/**
 * Объект ошибки приложения, представляющий ошибки,
 * полученные через библиотеку Superagent
 */
export class SuperagentNetworkAppError extends AppError {
    constructor(superagentError = null) {
        super()
        this.name = 'NetworkAppError'
        if (superagentError) {
            this.parse(superagentError)
        }
    }

    /**
     * Разобрать ошибку
     * @param {*} error 
     */
    parse(error) {
        if (this.isMaybeAppError(error)) {
            this.message = 'Ошибка при разборе ответа сервера'
        } else if (this.isDisconnect(error)) {
            this.type = ERROR_TYPE.DISCONNECTED
            this.message = 'Сервер недоступен'
        } else if (this.hasServerError(error)) {
            this.mapResponse(error.response)
        } else {
            this.message = 'Неизвестная ошибка'
        }
    }

    /**
     * Проверка на возможную ошибку приложения.
     * @param {*} response 
     * @returns true или false
     * @description При разборе ответа сервера может возникнуть исключение,
     * не связанное напрямую с ошибочным ответом сервера.
     * Например, при использовании связки Superagent + OpenApi Middleware
     * возникает исключение при некоторых ответах (202  Accepted, 208  AlreadyReported, etc).
     * Middleware ожидает ответ определенного формата. 
     * При неожиданном формате возникает исключение "data.map is not a function".
     * При таком исключении в нем отсутствует свойство "error"
     */
    isMaybeAppError(response) {
        return !('error' in response)
    }

    /**
     * Отсутствие подключения к серверу
     * @param {*} error 
     * @returns true или false
     * @description При недоступности сервера в исключении,
     * формируемом Superagent, отсутствуют свойства "body", "response" и "statusText"
     */
    isDisconnect(error) {
        return !('body' in error && 'response' in error && 'statusText' in error)
    }

    /**
     * Получена ошибка, сформированная сервером
     * @param {*} error 
     * @returns true или false
     * @description Считаем признаком получения ошибки от сервера
     * наличие свойства "response"
     */
    hasServerError(error) {
        return 'response' in error
    }

    /**
     * Сопоставить ответы сервера и соответствующие 
     * свойства экземпляра AppError
     * @param {*} response 
     */
    mapResponse(response) {
        switch (response.status) {
            case 400:
                this.type = ERROR_TYPE.BADREQUEST
                this.message = 'Ошибочный формат запроса'
                this.detail = this.tryGetDetail(response)
                break
            case 401:
                this.type = ERROR_TYPE.UNAUTHORIZED
                this.message = 'Не хватает действительных учётных данных'
                this.detail = this.tryGetDetail(response)
                break
            case 403:
                this.type = ERROR_TYPE.FORBIDDEN
                this.message = 'Не авторизован'
                this.detail = this.tryGetDetail(response)
                break
            case 404:
                this.type = ERROR_TYPE.NOTFOUND
                this.message = 'Ресурс не найден'
                this.detail = this.tryGetDetail(response)
                break
            case 409:
                this.type = ERROR_TYPE.CONFLICT
                this.message = 'Ресурс уже существует'
                this.detail = this.tryGetDetail(response)
                break
            case 500:
                this.type = ERROR_TYPE.INTERNALSERVERERROR
                this.message = 'Ошибка сервера'
                this.detail = this.tryGetDetail(response)
                break
            default:
                this.message = 'Неизвестная ошибка'
                this.detail = this.tryGetDetail(response)
                break
        }
    }

    /**
     * Попробовать получить значения для свойства "detail" из ответа сервера
     * @param {*} response 
     * @returns 
     */
    tryGetDetail(response) {
        return response?.body?.detail ??
            response?.body?.Detail ??
            response?.body ?? null;
    }
}
