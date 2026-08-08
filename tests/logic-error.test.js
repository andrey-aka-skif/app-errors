import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, LogicError } from '../src/index.js'

describe('LogicError', () => {
  const TEST_MESSAGE = 'Test logic error'
  const TEST_DETAILS = { sum: 42 }

  describe('constructor', () => {
    it('Должен быть наследником LogicError и BaseAppError', () => {
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

    it('Должен сохранять исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new LogicError(TEST_MESSAGE, null, { cause: original })

      expect(error.cause).toBe(original)
    })
  })

  describe('проверка обязательного сообщения', () => {
    it.each([
      ['без аргументов', undefined],
      ['null', null],
      ['пустая строка', ''],
      ['строка из пробелов', '   '],
      ['число', 42],
      ['объект', {}],
    ])('%s — выбрасывает TypeError', (_описание, message) => {
      expect(() => new LogicError(message)).toThrow(TypeError)
    })

    it('сообщение об ошибке называет класс и параметр', () => {
      expect(() => new LogicError()).toThrow(/LogicError.*message/)
    })
  })
})
