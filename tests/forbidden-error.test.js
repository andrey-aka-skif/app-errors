import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  ForbiddenError,
} from '../src/index.js'

describe('ForbiddenError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр ForbiddenError, HttpError и BaseAppError', () => {
      const error = new ForbiddenError()
      expect(error).toBeInstanceOf(ForbiddenError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.FORBIDDEN', () => {
      const error = new ForbiddenError()
      expect(error.type).toBe(ERROR_TYPE.FORBIDDEN)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new ForbiddenError()
      expect(error.message).toBe('Forbidden')
    })

    it('должен установить HTTP-статус 403', () => {
      const error = new ForbiddenError()
      expect(error.status).toBe(403)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 403 }
      const errorWithDetails = new ForbiddenError(customDetails)
      const errorWithoutDetails = new ForbiddenError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new ForbiddenError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new ForbiddenError()
      expect(error).toBeInstanceOf(ForbiddenError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new ForbiddenError()).not.toThrow()
    })
  })
})
