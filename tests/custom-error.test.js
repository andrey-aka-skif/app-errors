import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, CustomError } from '../src/index.js'

describe('CustomError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр CustomError и BaseAppError', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error).toBeInstanceOf(CustomError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('должен установить переданный тип ошибки', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error.type).toBe('TEST_TYPE')
    })

    it('должен использовать ERROR_TYPE.CUSTOM как значение по умолчанию для сообщения', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error.message).toBe(ERROR_TYPE.CUSTOM)
    })

    it('должен использовать переданное сообщение', () => {
      const customMessage = 'Custom error message'
      const error = new CustomError('TEST_TYPE', customMessage)
      expect(error.message).toBe(customMessage)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 400 }
      const errorWithDetails = new CustomError(
        'TEST_TYPE',
        undefined,
        customDetails
      )
      const errorWithoutDetails = new CustomError('TEST_TYPE')

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })

    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new CustomError('TEST_TYPE', undefined, undefined)
      expect(error.message).toBe(ERROR_TYPE.CUSTOM)
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр с минимальными параметрами', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error.type).toBe('TEST_TYPE')
      expect(error.message).toBe(ERROR_TYPE.CUSTOM)
      expect(error.details).toBeNull()
    })

    it('должен не блокировать создание подкласса', () => {
      expect(() => new CustomError('TEST_TYPE')).not.toThrow()
    })
  })
})
