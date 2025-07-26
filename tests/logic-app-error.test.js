import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, LogicError } from '../src/index.js'

describe('LogicError', () => {
  const TEST_MESSAGE = 'Test logic error'
  const TEST_DETAILS = { sum: 42 }

  describe('constructor', () => {
    it('Должен быть наследником LogicAppError и BaseAppError', () => {
      const error = new LogicError(TEST_MESSAGE)
      expect(error).toBeInstanceOf(LogicError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('Должен иметь тип ERROR_TYPE.LOGIC', () => {
      const error = new LogicError(TEST_MESSAGE)
      expect(error.type).toBe(ERROR_TYPE.LOGIC)
    })

    it('Должен содержать переданные message и details', () => {
      const error = new LogicError(TEST_MESSAGE, TEST_DETAILS)
      expect(error.message).toBe(TEST_MESSAGE)
      expect(error.details).toBe(TEST_DETAILS)
    })

    it('Должен содержать null для details, если он не был передан', () => {
      const error = new LogicError(TEST_MESSAGE)
      expect(error.details).toBeNull()
    })
  })
})
