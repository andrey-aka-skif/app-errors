import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, UnknownError } from '../src/index.js'

describe('UnknownError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр UnknownError и BaseAppError', () => {
      const error = new UnknownError()
      expect(error).toBeInstanceOf(UnknownError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить тип и сообщение ошибки из ERROR_TYPE.UNKNOWN', () => {
      const error = new UnknownError()
      expect(error.type).toBe(ERROR_TYPE.UNKNOWN)
      expect(error.message).toBe(ERROR_TYPE.UNKNOWN)
    })

    it('должен установить детали в null', () => {
      const error = new UnknownError()
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр без аргументов', () => {
      const error = new UnknownError()
      expect(error).toBeInstanceOf(UnknownError)
    })
  })
})
