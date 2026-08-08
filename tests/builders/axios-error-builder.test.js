import { describe, it, expect } from 'vitest'
import {
  fromAxios,
  BaseAppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  DisconnectedError,
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
  [500, InternalServerError],
]

describe('fromAxios', () => {
  describe('ответ сервера с известным статусом', () => {
    it.each(MAPPED_STATUSES)(
      'статус %i преобразуется в %s',
      (status, ErrorClass) => {
        const error = fromAxios(serverError(status, null))

        expect(error).toBeInstanceOf(ErrorClass)
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

  describe('ответ сервера с неизвестным статусом', () => {
    // 422, 429 и 5xx от прокси — самые частые из непокрытых. Сейчас все они
    // схлопываются в UnknownError, теряя и статус, и тело ответа.
    it.each([418, 422, 429, 502, 503, 504])(
      'статус %i преобразуется в UnknownError',
      status => {
        const error = fromAxios(serverError(status, { detail: 'подробности' }))

        expect(error).toBeInstanceOf(UnknownError)
      }
    )

    it('исходный статус не сохраняется', () => {
      const error = fromAxios(serverError(503, null))

      expect(error.status).toBeUndefined()
    })

    it('тело ответа не сохраняется', () => {
      const error = fromAxios(serverError(503, { detail: 'подробности' }))

      expect(error.details).toBeNull()
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

    it('таймаут преобразуется в DisconnectedError', () => {
      // Таймаут неотличим от обрыва связи: у него тоже есть request и нет
      // response, а code не проверяется.
      const error = fromAxios({
        isAxiosError: true,
        code: 'ECONNABORTED',
        request: {},
      })

      expect(error).toBeInstanceOf(DisconnectedError)
    })

    it('отменённый запрос преобразуется в UnknownError', () => {
      const error = fromAxios({ isAxiosError: true, code: 'ERR_CANCELED' })

      expect(error).toBeInstanceOf(UnknownError)
    })

    it('ошибка без response и без request преобразуется в UnknownError', () => {
      const error = fromAxios({ isAxiosError: true })

      expect(error).toBeInstanceOf(UnknownError)
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
    // Известный дефект (#66): билдер на пути обработки ошибок падает сам.
    // Тесты написаны под ожидаемое поведение и станут зелёными после
    // добавления гарда.
    it.fails('null преобразуется в UnknownError', () => {
      expect(fromAxios(null)).toBeInstanceOf(UnknownError)
    })

    it.fails('undefined преобразуется в UnknownError', () => {
      expect(fromAxios(undefined)).toBeInstanceOf(UnknownError)
    })

    it('сейчас на null выбрасывается TypeError', () => {
      expect(() => fromAxios(null)).toThrow(TypeError)
    })
  })
})
