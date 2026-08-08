import { describe, it, expect } from 'vitest'
import { BaseAppError, CustomError } from '../src/index.js'

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

    it('должен использовать человекочитаемое сообщение по умолчанию', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error.message).toBe('Custom Error')
    })

    it('должен использовать переданное сообщение', () => {
      const customMessage = 'Custom error message'
      const error = new CustomError('TEST_TYPE', null, {
        message: customMessage,
      })
      expect(error.message).toBe(customMessage)
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { code: 400 }
      const errorWithDetails = new CustomError('TEST_TYPE', customDetails)
      const errorWithoutDetails = new CustomError('TEST_TYPE')

      expect(errorWithDetails.details).toBe(customDetails)
      expect(errorWithoutDetails.details).toBeNull()
    })

    it('должен корректно обрабатывать undefined в параметрах', () => {
      const error = new CustomError('TEST_TYPE', undefined, undefined)
      expect(error.message).toBe('Custom Error')
      expect(error.details).toBeNull()
    })

    it('должен позволять создавать экземпляр с минимальными параметрами', () => {
      const error = new CustomError('TEST_TYPE')
      expect(error.type).toBe('TEST_TYPE')
      expect(error.message).toBe('Custom Error')
      expect(error.details).toBeNull()
    })

    it('должен сохранять исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new CustomError('TEST_TYPE', null, { cause: original })

      expect(error.cause).toBe(original)
    })
  })

  describe('проверка обязательного типа', () => {
    // Без проверки вызов без типа молча дал бы type === undefined,
    // и дефект всплыл бы далеко от места создания ошибки.
    it.each([
      ['без аргументов', undefined],
      ['null', null],
      ['пустая строка', ''],
      ['строка из пробелов', '   '],
      ['число', 42],
      ['объект', {}],
    ])('%s — выбрасывает TypeError', (_описание, type) => {
      expect(() => new CustomError(type)).toThrow(TypeError)
    })

    it('сообщение об ошибке называет класс и параметр', () => {
      expect(() => new CustomError()).toThrow(/CustomError.*type/)
    })
  })
})
