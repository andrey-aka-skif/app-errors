import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  TimeoutError,
} from '../src/index.js'

describe('TimeoutError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр TimeoutError и BaseAppError', () => {
      const error = new TimeoutError()
      expect(error).toBeInstanceOf(TimeoutError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('не является HttpError: ответа сервера нет, значит нет и статуса', () => {
      const error = new TimeoutError()
      expect(error).not.toBeInstanceOf(HttpError)
      expect(error.status).toBeUndefined()
    })

    it('должен установить тип ошибки из ERROR_TYPE.TIMEOUT', () => {
      const error = new TimeoutError()
      expect(error.type).toBe(ERROR_TYPE.TIMEOUT)
    })

    it('должен установить человекочитаемое сообщение', () => {
      const error = new TimeoutError()
      expect(error.message).toBe('Request Timeout')
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { timeout: 5000 }

      expect(new TimeoutError(customDetails).details).toBe(customDetails)
      expect(new TimeoutError().details).toBeNull()
    })

    it('должен принимать своё сообщение и исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new TimeoutError(null, {
        message: 'своё сообщение',
        cause: original,
      })

      expect(error.message).toBe('своё сообщение')
      expect(error.cause).toBe(original)
    })
  })
})
