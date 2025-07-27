import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, InternalServerError } from '../src/index.js'

describe('InternalServerError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр InternalServerError и BaseAppError', () => {
      const error = new InternalServerError()
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип и сообщение ошибки из ERROR_TYPE.INTERNALSERVERERROR', () => {
      const error = new InternalServerError()
      expect(error.type).toBe(ERROR_TYPE.INTERNALSERVERERROR)
      expect(error.message).toBe(ERROR_TYPE.INTERNALSERVERERROR)
    })

    it('должен установить HTTP-статус 500', () => {
      const error = new InternalServerError()
      expect(error.status).toBe(500)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 500 }
      const errorWithDetails = new InternalServerError(customDetails)
      const errorWithoutDetails = new InternalServerError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })

    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new InternalServerError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new InternalServerError()
      expect(error).toBeInstanceOf(InternalServerError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new InternalServerError()).not.toThrow()
    })
  })
})
