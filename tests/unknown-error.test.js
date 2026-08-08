import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, UnknownError } from '../src/index.js'

describe('UnknownError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр UnknownError и BaseAppError', () => {
      const error = new UnknownError()
      expect(error).toBeInstanceOf(UnknownError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип ошибки из ERROR_TYPE.UNKNOWN', () => {
      const error = new UnknownError()
      expect(error.type).toBe(ERROR_TYPE.UNKNOWN)
    })

    it('должен установить человекочитаемое сообщение', () => {
      const error = new UnknownError()
      expect(error.message).toBe('Unknown Error')
    })

    it('должен установить детали в null по умолчанию', () => {
      const error = new UnknownError()
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new UnknownError()
      expect(error).toBeInstanceOf(UnknownError)
    })
  })

  describe('детали и причина', () => {
    it('должен принимать детали', () => {
      const details = { code: 42 }
      expect(new UnknownError(details).details).toBe(details)
    })

    it('должен принимать своё сообщение и исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new UnknownError(null, {
        message: 'своё сообщение',
        cause: original,
      })

      expect(error.message).toBe('своё сообщение')
      expect(error.cause).toBe(original)
    })
  })
})
