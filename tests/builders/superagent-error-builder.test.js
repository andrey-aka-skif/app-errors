import { describe, it, expect } from 'vitest'
import {
  fromSuperagent,
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
 * Фикстура ошибки Superagent с ответом сервера.
 * Билдер опознаёт такую ошибку по одновременному наличию body, response
 * и statusText, поэтому все три поля обязательны.
 */
const serverError = (status, body) => ({
  error: true,
  body,
  statusText: 'Error',
  response: { status, body },
})

/**
 * Фикстура недоступного сервера: Superagent не заполняет body, response
 * и statusText.
 */
const disconnectError = () => ({
  error: true,
  message: 'connect ECONNREFUSED',
})

const MAPPED_STATUSES = [
  [400, BadRequestError],
  [401, UnauthorizedError],
  [403, ForbiddenError],
  [404, NotFoundError],
  [409, ConflictError],
  [500, InternalServerError],
]

describe('fromSuperagent', () => {
  describe('ответ сервера с известным статусом', () => {
    it.each(MAPPED_STATUSES)(
      'статус %i преобразуется в %s',
      (status, ErrorClass) => {
        const error = fromSuperagent(serverError(status, null))

        expect(error).toBeInstanceOf(ErrorClass)
        expect(error).toBeInstanceOf(BaseAppError)
        expect(error.status).toBe(status)
      }
    )

    it.each(MAPPED_STATUSES)(
      'для статуса %i значение detail попадает в details',
      status => {
        const error = fromSuperagent(
          serverError(status, { detail: 'подробности' })
        )

        expect(error.details).toBe('подробности')
      }
    )
  })

  describe('ответ сервера с неизвестным статусом', () => {
    it.each([418, 422, 429, 502, 503, 504])(
      'статус %i преобразуется в UnknownError',
      status => {
        const error = fromSuperagent(
          serverError(status, { detail: 'подробности' })
        )

        expect(error).toBeInstanceOf(UnknownError)
      }
    )

    it('исходный статус не сохраняется', () => {
      const error = fromSuperagent(serverError(503, null))

      expect(error.status).toBeUndefined()
    })
  })

  describe('извлечение details из тела ответа', () => {
    it.each([
      ['body.detail', { detail: 'нижний регистр' }, 'нижний регистр'],
      ['body.Detail', { Detail: 'верхний регистр' }, 'верхний регистр'],
      ['всё тело, если ни detail, ни Detail нет', { code: 42 }, { code: 42 }],
      ['пустая строка сохраняется как есть', { detail: '' }, ''],
      ['null, если тело равно null', null, null],
    ])('%s', (_описание, body, expected) => {
      const error = fromSuperagent(serverError(404, body))

      expect(error.details).toEqual(expected)
    })

    it('detail имеет приоритет над Detail', () => {
      const body = { detail: 'нижний', Detail: 'верхний' }
      const error = fromSuperagent(serverError(404, body))

      expect(error.details).toBe('нижний')
    })
  })

  describe('недоступность сервера', () => {
    it('ошибка без body, response и statusText даёт DisconnectedError', () => {
      const error = fromSuperagent(disconnectError())

      expect(error).toBeInstanceOf(DisconnectedError)
    })

    it.each(['body', 'response', 'statusText'])(
      'отсутствия одного только поля %s достаточно для DisconnectedError',
      missing => {
        const error = serverError(404, { detail: 'подробности' })
        delete error[missing]

        expect(fromSuperagent(error)).toBeInstanceOf(DisconnectedError)
      }
    )

    it('таймаут преобразуется в DisconnectedError', () => {
      // Флаг timeout не проверяется: срабатывает та же ветка, что и на обрыв.
      const error = fromSuperagent({ error: true, timeout: 5000 })

      expect(error).toBeInstanceOf(DisconnectedError)
    })
  })

  describe('исключения, не связанные с ответом сервера', () => {
    it('ошибка без поля error преобразуется в UnknownError', () => {
      // Связка Superagent + OpenApi Middleware бросает, например,
      // "data.map is not a function" — в таком исключении поля error нет.
      const error = fromSuperagent(new TypeError('data.map is not a function'))

      expect(error).toBeInstanceOf(UnknownError)
    })

    it('произвольный объект без поля error даёт UnknownError', () => {
      const error = fromSuperagent({ response: { status: 404 } })

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
      expect(fromSuperagent(input)).toBeInstanceOf(UnknownError)
    })

    it('не выбрасывает исключение сам', () => {
      expect(() => fromSuperagent(null)).not.toThrow()
    })
  })
})
