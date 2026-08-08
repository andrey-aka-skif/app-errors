import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  ConflictError,
} from '../src/index.js'

describe('ConflictError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр ConflictError, HttpError и BaseAppError', () => {
      const error = new ConflictError()
      expect(error).toBeInstanceOf(ConflictError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.CONFLICT', () => {
      const error = new ConflictError()
      expect(error.type).toBe(ERROR_TYPE.CONFLICT)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new ConflictError()
      expect(error.message).toBe('Conflict')
    })

    it('должен установить HTTP-статус 409', () => {
      const error = new ConflictError()
      expect(error.status).toBe(409)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 409 }
      const errorWithDetails = new ConflictError(customDetails)
      const errorWithoutDetails = new ConflictError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new ConflictError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new ConflictError()
      expect(error).toBeInstanceOf(ConflictError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new ConflictError()).not.toThrow()
    })
  })
})
