import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  InternalServerError,
} from '../src/index.js'

describe('InternalServerError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр InternalServerError, HttpError и BaseAppError', () => {
      const error = new InternalServerError()
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.INTERNAL_SERVER_ERROR', () => {
      const error = new InternalServerError()
      expect(error.type).toBe(ERROR_TYPE.INTERNAL_SERVER_ERROR)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new InternalServerError()
      expect(error.message).toBe('Internal Server Error')
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
  })

  describe('граничные случаи', () => {
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
