import { isParsable } from './is-parsable.js'
import { createDetailExtractor } from './create-detail-extractor.js'
import { statusToError } from './http-status-map.js'
import UnknownError from '../errors/unknown-error.js'
import DisconnectedError from '../errors/disconnected-error.js'
import TimeoutError from '../errors/timeout-error.js'

/** Superagent кладёт тело ответа в свойство "body". */
const getDetail = createDetailExtractor('body')

/**
 * Не является ли исключение ошибкой Superagent.
 * @description При разборе ответа сервера может возникнуть исключение,
 * не связанное напрямую с ошибочным ответом сервера.
 * Например, при использовании связки Superagent + OpenApi Middleware
 * возникает исключение при некоторых ответах (202 Accepted,
 * 208 AlreadyReported, etc). Middleware ожидает ответ определенного формата.
 * При неожиданном формате возникает исключение "data.map is not a function".
 * При таком исключении в нем отсутствует свойство "error".
 *
 * @param {*} error - Исключение, которое нужно проверить
 * @returns {boolean} true, если исключение не содержит свойства "error"
 */
const isNotSuperagentError = error => {
  return !('error' in error)
}

/**
 * Проверяет, что в ошибке нет ответа от сервера.
 * @description При недоступности сервера в исключении,
 * формируемом Superagent, отсутствуют свойства "body", "response" и "statusText"
 * @param {*} error - Объект ошибки для проверки
 * @returns {boolean} true, если серверного ответа в ошибке нет
 */
const isDisconnect = error => {
  return !('body' in error && 'response' in error && 'statusText' in error)
}

/**
 * Основная функция преобразования ошибок Superagent в стандартные ошибки
 * приложения. Выполняет последовательную проверку:
 * 1. Пригодность аргумента для разбора
 * 2. Истечение времени ожидания (error.timeout)
 * 3. Исключение, не являющееся ошибкой Superagent (isNotSuperagentError)
 * 4. Потеря соединения (isDisconnect)
 * Всё, что прошло эти проверки, содержит ответ сервера.
 *
 * Проверка таймаута стоит сразу после разбора пригодности, а не перед
 * isDisconnect: Superagent формирует таймаут методом RequestBase._timeoutError
 * как обычный Error со свойствами timeout, code и errno — свойства "error"
 * в нём нет, и ниже по цепочке ветку перехватил бы isNotSuperagentError.
 * Условие срабатывает только на объектах с истинным timeout, то есть
 * на таймаутах по определению.
 *
 * Исходная ошибка передаётся в cause на каждой ветке.
 * Никогда не выбрасывает исключение: функция вызывается в catch-блоках,
 * где собственное падение скрыло бы исходную ошибку.
 * @param {*} error - Исходная ошибка от Superagent
 * @returns {BaseAppError} Экземпляр одного из классов ошибок
 */
export const fromSuperagent = error => {
  if (!isParsable(error)) {
    return new UnknownError(null, { cause: error })
  }

  if (error.timeout) {
    return new TimeoutError(null, { cause: error })
  }

  if (isNotSuperagentError(error)) {
    return new UnknownError(null, { cause: error })
  }

  if (isDisconnect(error)) {
    return new DisconnectedError(null, { cause: error })
  }

  return statusToError(error.response.status, getDetail(error.response), error)
}
