import { isParsable } from './is-parsable.js'
import { createDetailExtractor } from './create-detail-extractor.js'
import { statusToError } from './http-status-map.js'
import UnknownError from '../errors/unknown-error.js'
import DisconnectedError from '../errors/disconnected-error.js'
import TimeoutError from '../errors/timeout-error.js'
import CanceledError from '../errors/canceled-error.js'

/** Axios кладёт тело ответа в свойство "data". */
const getDetail = createDetailExtractor('data')

/** Коды Axios, означающие истечение времени ожидания. */
const TIMEOUT_CODES = ['ECONNABORTED', 'ETIMEDOUT']

/**
 * Основная функция преобразования ошибок Axios в стандартные ошибки приложения.
 * Выполняет последовательную проверку:
 * 1. Пригодность аргумента для разбора
 * 2. Проверка, является ли ошибка Axios (error.isAxiosError)
 * 3. Наличие ответа от сервера (error.response)
 * 4. Отмена запроса (code === 'ERR_CANCELED')
 * 5. Истечение времени ожидания (code из TIMEOUT_CODES)
 * 6. Обрыв связи: code === 'ERR_NETWORK' либо запрос без ответа
 *
 * Отмена и таймаут проверяются до ветки error.request: у обоих запрос есть,
 * а ответа нет, и без проверки кода они уходили бы в DisconnectedError.
 * Ответ сервера проверяется первым: он информативнее кода транспорта,
 * и одновременно с кодом Axios его не выставляет.
 *
 * Исходная ошибка передаётся в cause на каждой ветке: без неё теряются URL,
 * метод, заголовки и исходный стектрейс, а система сбора ошибок схлопывает
 * все обращения в несколько групп по одинаковым сообщениям.
 *
 * Никогда не выбрасывает исключение: функция вызывается в catch-блоках,
 * где собственное падение скрыло бы исходную ошибку.
 * @param {*} error - Исходная ошибка от Axios
 * @returns {BaseAppError} Экземпляр одного из классов ошибок
 */
export const fromAxios = error => {
  if (!isParsable(error)) {
    return new UnknownError(null, { cause: error })
  }

  if (!error.isAxiosError) {
    return new UnknownError(null, { cause: error })
  }

  if (error.response) {
    return statusToError(
      error.response.status,
      getDetail(error.response),
      error
    )
  }

  if (error.code === 'ERR_CANCELED') {
    return new CanceledError(null, { cause: error })
  }

  if (TIMEOUT_CODES.includes(error.code)) {
    return new TimeoutError(null, { cause: error })
  }

  if (error.code === 'ERR_NETWORK' || error.request) {
    return new DisconnectedError(null, { cause: error })
  }

  return new UnknownError(null, { cause: error })
}
