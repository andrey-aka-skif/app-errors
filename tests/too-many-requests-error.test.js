import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  TooManyRequestsError,
} from '../src/index.js'

describe('TooManyRequestsError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр TooManyRequestsError, HttpError и BaseAppError', () => {
      const error = new TooManyRequestsError()
      expect(error).toBeInstanceOf(TooManyRequestsError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.TOO_MANY_REQUESTS', () => {
      const error = new TooManyRequestsError()
      expect(error.type).toBe(ERROR_TYPE.TOO_MANY_REQUESTS)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new TooManyRequestsError()
      expect(error.message).toBe('Too Many Requests')
    })

    it('должен установить HTTP-статус 429', () => {
      const error = new TooManyRequestsError()
      expect(error.status).toBe(429)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { retryAfter: 30 }
      const errorWithDetails = new TooManyRequestsError(customDetails)
      const errorWithoutDetails = new TooManyRequestsError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new TooManyRequestsError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new TooManyRequestsError()
      expect(error).toBeInstanceOf(TooManyRequestsError)
    })
  })
})
