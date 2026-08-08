import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  NotFoundError,
} from '../src/index.js'

describe('NotFoundError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр NotFoundError, HttpError и BaseAppError', () => {
      const error = new NotFoundError()
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.NOT_FOUND', () => {
      const error = new NotFoundError()
      expect(error.type).toBe(ERROR_TYPE.NOT_FOUND)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new NotFoundError()
      expect(error.message).toBe('Not Found')
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
  })

  describe('граничные случаи', () => {
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
