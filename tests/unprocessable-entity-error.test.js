import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  UnprocessableEntityError,
} from '../src/index.js'

describe('UnprocessableEntityError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр UnprocessableEntityError, HttpError и BaseAppError', () => {
      const error = new UnprocessableEntityError()
      expect(error).toBeInstanceOf(UnprocessableEntityError)
      expect(error).toBeInstanceOf(HttpError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.UNPROCESSABLE_ENTITY', () => {
      const error = new UnprocessableEntityError()
      expect(error.type).toBe(ERROR_TYPE.UNPROCESSABLE_ENTITY)
    })

    it('должен установить сообщение из причинной фразы статуса', () => {
      const error = new UnprocessableEntityError()
      expect(error.message).toBe('Unprocessable Entity')
    })

    it('должен установить HTTP-статус 422', () => {
      const error = new UnprocessableEntityError()
      expect(error.status).toBe(422)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { errors: ['поле обязательно'] }
      const errorWithDetails = new UnprocessableEntityError(customDetails)
      const errorWithoutDetails = new UnprocessableEntityError()

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })
  })

  describe('граничные случаи', () => {
    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new UnprocessableEntityError(undefined)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new UnprocessableEntityError()
      expect(error).toBeInstanceOf(UnprocessableEntityError)
    })
  })
})
