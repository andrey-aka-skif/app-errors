import { describe, it, expect } from 'vitest'
import {
  fromAxios,
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  TooManyRequestsError,
  InternalServerError,
  DisconnectedError,
  TimeoutError,
  CanceledError,
  UnknownError,
} from '../../src/index.js'

/**
 * Фикстура ошибки Axios с ответом сервера.
 * Строится вручную, чтобы не тянуть axios в devDependencies.
 */
const serverError = (status, data) => ({
  isAxiosError: true,
  response: { status, data },
})

/** Фикстура ошибки Axios без ответа: запрос ушёл, ответа не было. */
const networkError = () => ({
  isAxiosError: true,
  request: {},
})

const MAPPED_STATUSES = [
  [400, BadRequestError],
  [401, UnauthorizedError],
  [403, ForbiddenError],
  [404, NotFoundError],
  [409, ConflictError],
  [422, UnprocessableEntityError],
  [429, TooManyRequestsError],
  [500, InternalServerError],
]

describe('fromAxios', () => {
  describe('ответ сервера с известным статусом', () => {
    it.each(MAPPED_STATUSES)(
      'статус %i преобразуется в %s',
      (status, ErrorClass) => {
        const error = fromAxios(serverError(status, null))

        expect(error).toBeInstanceOf(ErrorClass)
        expect(error).toBeInstanceOf(HttpError)
        expect(error).toBeInstanceOf(BaseAppError)
        expect(error.status).toBe(status)
      }
    )

    it.each(MAPPED_STATUSES)(
      'для статуса %i значение detail попадает в details',
      status => {
        const error = fromAxios(serverError(status, { detail: 'подробности' }))

        expect(error.details).toBe('подробности')
      }
    )
  })

  describe('ответ сервера со статусом без отдельного класса', () => {
    // 502, 503 и 504 от прокси — самые частые статусы без отдельного
    // класса и самые ретраибельные. Статус и тело ответа должны доезжать
    // до потребителя, иначе решение о повторе принять не на чем.
    it.each([418, 502, 503, 504])(
      'статус %i преобразуется в обобщённый HttpError',
      status => {
        const error = fromAxios(serverError(status, { detail: 'подробности' }))

        expect(error).toBeInstanceOf(HttpError)
        expect(error).not.toBeInstanceOf(UnknownError)
        expect(error.type).toBe(ERROR_TYPE.HTTP)
      }
    )

    it('исходный статус сохраняется', () => {
      expect(fromAxios(serverError(503, null)).status).toBe(503)
    })

    it('тело ответа сохраняется', () => {
      const error = fromAxios(serverError(503, { detail: 'подробности' }))

      expect(error.details).toBe('подробности')
    })

    it('сообщение берётся из причинной фразы статуса', () => {
      expect(fromAxios(serverError(502, null)).message).toBe('Bad Gateway')
    })

    it('нечисловой статус не ломает разбор', () => {
      // Поиск идёт по Map: ключ вида "constructor" не достаёт из таблицы
      // унаследованное свойство Object.prototype.
      const error = fromAxios(serverError('constructor', null))

      expect(error).toBeInstanceOf(HttpError)
    })
  })

  describe('извлечение details из тела ответа', () => {
    it.each([
      ['data.detail', { detail: 'нижний регистр' }, 'нижний регистр'],
      ['data.Detail', { Detail: 'верхний регистр' }, 'верхний регистр'],
      ['всё тело, если ни detail, ни Detail нет', { code: 42 }, { code: 42 }],
      ['строковое тело', 'просто текст', 'просто текст'],
      ['пустая строка сохраняется как есть', { detail: '' }, ''],
      ['null, если тело равно null', null, null],
      ['null, если тела нет', undefined, null],
    ])('%s', (_описание, data, expected) => {
      const error = fromAxios(serverError(404, data))

      expect(error.details).toEqual(expected)
    })

    it('detail имеет приоритет над Detail', () => {
      const data = { detail: 'нижний', Detail: 'верхний' }
      const error = fromAxios(serverError(404, data))

      expect(error.details).toBe('нижний')
    })

    it('detail со значением null приводит к возврату всего тела', () => {
      // Следствие ??: null не проходит, и цепочка доходит до самого data.
      const data = { detail: null }
      const error = fromAxios(serverError(404, data))

      expect(error.details).toEqual(data)
    })
  })

  describe('ошибки без ответа сервера', () => {
    it('запрос без ответа преобразуется в DisconnectedError', () => {
      const error = fromAxios(networkError())

      expect(error).toBeInstanceOf(DisconnectedError)
    })

    it('код ERR_NETWORK преобразуется в DisconnectedError', () => {
      const error = fromAxios({ isAxiosError: true, code: 'ERR_NETWORK' })

      expect(error).toBeInstanceOf(DisconnectedError)
    })

    it.each(['ECONNABORTED', 'ETIMEDOUT'])(
      'код %s преобразуется в TimeoutError',
      code => {
        // Проверка кода стоит до ветки error.request: у таймаута запрос тоже
        // есть, и без неё он был бы неотличим от обрыва связи.
        const error = fromAxios({ isAxiosError: true, code, request: {} })

        expect(error).toBeInstanceOf(TimeoutError)
        expect(error).not.toBeInstanceOf(DisconnectedError)
      }
    )

    it('отменённый запрос преобразуется в CanceledError', () => {
      const error = fromAxios({ isAxiosError: true, code: 'ERR_CANCELED' })

      expect(error).toBeInstanceOf(CanceledError)
    })

    it('отмена распознаётся и при наличии запроса', () => {
      const error = fromAxios({
        isAxiosError: true,
        code: 'ERR_CANCELED',
        request: {},
      })

      expect(error).toBeInstanceOf(CanceledError)
    })

    it('ошибка без response и без request преобразуется в UnknownError', () => {
      const error = fromAxios({ isAxiosError: true })

      expect(error).toBeInstanceOf(UnknownError)
    })
  })

  describe('исходная ошибка сохраняется в cause', () => {
    it.each([
      ['ответ сервера', serverError(404, null)],
      ['неизвестный статус', serverError(503, null)],
      ['обрыв связи', { isAxiosError: true, request: {} }],
      ['таймаут', { isAxiosError: true, code: 'ECONNABORTED', request: {} }],
      ['отмена', { isAxiosError: true, code: 'ERR_CANCELED' }],
      ['ошибка без ответа и запроса', { isAxiosError: true }],
    ])('%s', (_описание, source) => {
      // Без cause теряются URL, метод, заголовки и исходный стектрейс —
      // система сбора ошибок схлопнула бы всё в несколько групп.
      expect(fromAxios(source).cause).toBe(source)
    })

    it('ошибка не от Axios тоже попадает в cause', () => {
      const source = new Error('что-то пошло не так')

      expect(fromAxios(source).cause).toBe(source)
    })
  })

  describe('ошибки не от Axios', () => {
    it('обычный Error преобразуется в UnknownError', () => {
      const error = fromAxios(new Error('что-то пошло не так'))

      expect(error).toBeInstanceOf(UnknownError)
    })

    it('произвольный объект преобразуется в UnknownError', () => {
      const error = fromAxios({ response: { status: 404 } })

      expect(error).toBeInstanceOf(UnknownError)
    })
  })

  describe('некорректный вход', () => {
    it.each([
      ['null', null],
      ['undefined', undefined],
      ['строка', 'что-то пошло не так'],
      ['число', 500],
    ])('%s преобразуется в UnknownError', (_описание, input) => {
      expect(fromAxios(input)).toBeInstanceOf(UnknownError)
    })

    it('не выбрасывает исключение сам', () => {
      // Билдер вызывается в catch-блоке: собственное падение скрыло бы
      // исходную ошибку.
      expect(() => fromAxios(null)).not.toThrow()
    })
  })
})
