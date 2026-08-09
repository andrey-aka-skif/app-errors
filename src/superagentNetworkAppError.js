import { ErrorTypes } from './errorTypes.js'
import { AppError } from './AppError.js'

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
    if (!this.isObjectLike(error)) {
      this.message = 'Неизвестная ошибка'
    } else if (this.isMaybeAppError(error)) {
      this.message = 'Ошибка при разборе ответа сервера'
    } else if (this.isDisconnect(error)) {
      this.type = ErrorTypes.DISCONNECTED
      this.message = 'Сервер недоступен'
    } else {
      // Отдельная проверка на наличие "response" не нужна: после isDisconnect
      // это свойство заведомо есть.
      this.mapResponse(error.response)
    }
  }

  /**
   * Аргумент пригоден для проверок оператором "in"
   * @param {*} error
   * @returns true или false
   * @description Класс вызывается из catch-блоков, куда может прилететь что
   * угодно, в том числе строка или число. Оператор "in" на примитиве бросает
   * TypeError, и собственное падение разбора скрыло бы исходную ошибку.
   */
  isObjectLike(error) {
    return (typeof error === 'object' || typeof error === 'function') && !!error
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
   * Сопоставить ответы сервера и соответствующие
   * свойства экземпляра AppError
   * @param {*} response
   */
  mapResponse(response) {
    switch (response.status) {
      case 400:
        this.type = ErrorTypes.BADREQUEST
        this.message = 'Ошибочный формат запроса'
        this.detail = this.tryGetDetail(response)
        break
      case 401:
        this.type = ErrorTypes.UNAUTHORIZED
        this.message = 'Не хватает действительных учётных данных'
        this.detail = this.tryGetDetail(response)
        break
      case 403:
        this.type = ErrorTypes.FORBIDDEN
        this.message = 'Не авторизован'
        this.detail = this.tryGetDetail(response)
        break
      case 404:
        this.type = ErrorTypes.NOTFOUND
        this.message = 'Ресурс не найден'
        this.detail = this.tryGetDetail(response)
        break
      case 409:
        this.type = ErrorTypes.CONFLICT
        this.message = 'Ресурс уже существует'
        this.detail = this.tryGetDetail(response)
        break
      case 500:
        this.type = ErrorTypes.INTERNALSERVERERROR
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
    return (
      response?.body?.detail ?? response?.body?.Detail ?? response?.body ?? null
    )
  }
}
