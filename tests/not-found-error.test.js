import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, NotFoundError } from '../src/index.js'

describe('NotFoundError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр NotFoundError и BaseAppError', () => {
      const error = new NotFoundError()
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип и сообщение ошибки из ERROR_TYPE.NOTFOUND', () => {
      const error = new NotFoundError()
      expect(error.type).toBe(ERROR_TYPE.NOTFOUND)
      expect(error.message).toBe(ERROR_TYPE.NOTFOUND)
    })

    it('должен установить HTTP-статус 404', () => {
      const error = new NotFoundError()
      expect(error.status).toBe(404)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 404 }
      const errorWithDetails = new NotFoundError(customDetails)
      const errorWithoutDetails = new NotFoundError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })

    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new NotFoundError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new NotFoundError()
      expect(error).toBeInstanceOf(NotFoundError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new NotFoundError()).not.toThrow()
    })
  })
})
