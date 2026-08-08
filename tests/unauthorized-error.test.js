import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  UnauthorizedError,
} from '../src/index.js'

describe('UnauthorizedError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр UnauthorizedError, HttpError и BaseAppError', () => {
      const error = new UnauthorizedError()
      expect(error).toBeInstanceOf(UnauthorizedError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.UNAUTHORIZED', () => {
      const error = new UnauthorizedError()
      expect(error.type).toBe(ERROR_TYPE.UNAUTHORIZED)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new UnauthorizedError()
      expect(error.message).toBe('Unauthorized')
    })

    it('должен установить HTTP-статус 401', () => {
      const error = new UnauthorizedError()
      expect(error.status).toBe(401)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 401 }
      const errorWithDetails = new UnauthorizedError(customDetails)
      const errorWithoutDetails = new UnauthorizedError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new UnauthorizedError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new UnauthorizedError()
      expect(error).toBeInstanceOf(UnauthorizedError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new UnauthorizedError()).not.toThrow()
    })
  })
})
