import { ERROR_TYPE } from "./error-type"
import { AppError } from "./base-app-error"

/**
 * Объект ошибки приложения, представляющий ошибки,
 * полученные через библиотеку Axios
 */
export class AxiosNetworkAppError extends AppError {
    constructor(axiosError = null) {
        super()
        this.name = 'NetworkAppError'
        if (axiosError) {
            this.parse(axiosError)
        }
    }

    /**
     * Разобрать ошибку
     * @param {*} error 
     */
    parse(error) {
        if (error.response) {
            // Ошибка, связанная с ответом сервера
            this.mapResponse(error.response)
        } else if (error.request) {
            // Ошибка, связанная с недоступностью сервера
            this.type = ERROR_TYPE.DISCONNECTED
            this.message = 'Сервер недоступен'
        } else {
            // Другие ошибки
            this.message = 'Неизвестная ошибка'
        }
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
        return response?.data?.detail ??
            response?.data?.Detail ??
            response?.data ?? null;
    }
}
