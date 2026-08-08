import { describe, it, expect } from 'vitest'
import {
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
} from '../src/index.js'

/**
 * Головной класс семейства ошибок ответа сервера.
 *
 * Здесь же собрано общее поведение всех статус-классов: кастомное сообщение
 * и передача исходной ошибки. Проверять это в каждом из восьми файлов
 * значило бы восемь раз переписывать одно и то же.
 */

/** Все классы семейства с их статусами и причинными фразами. */
const STATUS_CLASSES = [
  ['BadRequestError', BadRequestError, 400, 'Bad Request'],
  ['UnauthorizedError', UnauthorizedError, 401, 'Unauthorized'],
  ['ForbiddenError', ForbiddenError, 403, 'Forbidden'],
  ['NotFoundError', NotFoundError, 404, 'Not Found'],
  ['ConflictError', ConflictError, 409, 'Conflict'],
  [
    'UnprocessableEntityError',
    UnprocessableEntityError,
    422,
    'Unprocessable Entity',
  ],
  ['TooManyRequestsError', TooManyRequestsError, 429, 'Too Many Requests'],
  ['InternalServerError', InternalServerError, 500, 'Internal Server Error'],
]

describe('HttpError', () => {
  describe('обобщённый экземпляр', () => {
    it('является наследником BaseAppError', () => {
      const error = new HttpError(503)

      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('хранит переданный статус', () => {
      expect(new HttpError(503).status).toBe(503)
    })

    it('имеет тип ERROR_TYPE.HTTP', () => {
      expect(new HttpError(503).type).toBe(ERROR_TYPE.HTTP)
    })

    it('задаёт собственное имя', () => {
      expect(new HttpError(503).name).toBe('HttpError')
    })

    it('использует переданные детали или null по умолчанию', () => {
      const details = { detail: 'сервис недоступен' }

      expect(new HttpError(503, details).details).toBe(details)
      expect(new HttpError(503).details).toBeNull()
    })
  })

  describe('сообщение по умолчанию', () => {
    it.each([
      [502, 'Bad Gateway'],
      [503, 'Service Unavailable'],
      [504, 'Gateway Timeout'],
    ])('статус %i даёт причинную фразу "%s"', (status, phrase) => {
      expect(new HttpError(status).message).toBe(phrase)
    })

    it('для статуса вне таблицы подставляет номер', () => {
      expect(new HttpError(418).message).toBe('HTTP 418')
    })

    it('для нечислового статуса подставляет запасную фразу', () => {
      // Ключ вида "toString" не должен достать ничего из Object.prototype.
      expect(new HttpError('toString').message).toBe('HTTP Error')
    })
  })

  describe('классы конкретных статусов', () => {
    it.each(STATUS_CLASSES)(
      '%s наследуется от HttpError и несёт статус %i',
      (_имя, ErrorClass, status) => {
        const error = new ErrorClass()

        expect(error).toBeInstanceOf(HttpError)
        expect(error.status).toBe(status)
      }
    )

    it.each(STATUS_CLASSES)(
      '%s берёт сообщение из причинной фразы статуса',
      (_имя, ErrorClass, _status, phrase) => {
        expect(new ErrorClass().message).toBe(phrase)
      }
    )

    it.each([
      ['BadRequestError', BadRequestError, 'Bad Request'],
      ['NotFoundError', NotFoundError, 'Not Found'],
      [
        'UnprocessableEntityError',
        UnprocessableEntityError,
        'Unprocessable Entity',
      ],
      ['TooManyRequestsError', TooManyRequestsError, 'Too Many Requests'],
      ['InternalServerError', InternalServerError, 'Internal Server Error'],
    ])(
      '%s: сообщение не совпадает с машинным токеном',
      (_имя, ErrorClass, phrase) => {
        // Сообщение человекочитаемо, тип машиночитаем. Проверяются только
        // составные фразы: у односложных статусов (Forbidden, Conflict)
        // фраза и токен совпадают закономерно, и расхождения там быть
        // не может.
        const error = new ErrorClass()

        expect(error.message).toBe(phrase)
        expect(error.message).not.toBe(error.type)
      }
    )
  })

  describe('кастомное сообщение', () => {
    it.each(STATUS_CLASSES)(
      '%s принимает своё сообщение',
      (_имя, ErrorClass) => {
        const error = new ErrorClass(null, { message: 'своё сообщение' })

        expect(error.message).toBe('своё сообщение')
      }
    )

    it('обобщённый HttpError принимает своё сообщение', () => {
      const error = new HttpError(503, null, { message: 'своё сообщение' })

      expect(error.message).toBe('своё сообщение')
    })

    it('сообщение не подменяет тип', () => {
      const error = new NotFoundError(null, { message: 'своё сообщение' })

      expect(error.type).toBe(ERROR_TYPE.NOT_FOUND)
    })
  })

  describe('исходная ошибка', () => {
    it.each(STATUS_CLASSES)('%s сохраняет причину', (_имя, ErrorClass) => {
      const original = new Error('исходная')
      const error = new ErrorClass(null, { cause: original })

      expect(error.cause).toBe(original)
    })

    it('обобщённый HttpError сохраняет причину', () => {
      const original = new Error('исходная')

      expect(new HttpError(503, null, { cause: original }).cause).toBe(original)
    })

    it('без причины свойство cause не появляется', () => {
      // Error заводит собственное свойство cause при одном лишь наличии
      // ключа в объекте опций, поэтому важно не передавать его впустую.
      expect('cause' in new NotFoundError()).toBe(false)
    })
  })
})
