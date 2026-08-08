import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  BadRequestError,
} from '../src/index.js'

describe('BadRequestError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр BadRequestError, HttpError и BaseAppError', () => {
      const error = new BadRequestError()
      expect(error).toBeInstanceOf(BadRequestError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.BAD_REQUEST', () => {
      const error = new BadRequestError()
      expect(error.type).toBe(ERROR_TYPE.BAD_REQUEST)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new BadRequestError()
      expect(error.message).toBe('Bad Request')
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 400 }
      const errorWithDetails = new BadRequestError(customDetails)
      const errorWithoutDetails = new BadRequestError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })

    it('должен установить HTTP-статус 400', () => {
      const error = new BadRequestError()
      expect(error.status).toBe(400)
    })

    it('должен сохранять свойства Error', () => {
      const error = new BadRequestError()
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('BadRequestError')
      expect(error.message).toBe('Bad Request')
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new BadRequestError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new BadRequestError()
      expect(error).toBeInstanceOf(BadRequestError)
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new BadRequestError()).not.toThrow()
    })
  })
})
