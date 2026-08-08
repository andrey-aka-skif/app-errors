import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  CanceledError,
} from '../src/index.js'

describe('CanceledError', () => {
  describe('constructor', () => {
    it('должен создать экземпляр CanceledError и BaseAppError', () => {
      const error = new CanceledError()
      expect(error).toBeInstanceOf(CanceledError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('не является HttpError: ответа сервера нет, значит нет и статуса', () => {
      const error = new CanceledError()
      expect(error).not.toBeInstanceOf(HttpError)
      expect(error.status).toBeUndefined()
    })

    it('должен установить тип ошибки из ERROR_TYPE.CANCELED', () => {
      const error = new CanceledError()
      expect(error.type).toBe(ERROR_TYPE.CANCELED)
    })

    it('должен установить человекочитаемое сообщение', () => {
      const error = new CanceledError()
      expect(error.message).toBe('Request Canceled')
    })

    it('должен использовать переданные детали или null по умолчанию', () => {
      const customDetails = { reason: 'уход со страницы' }

      expect(new CanceledError(customDetails).details).toBe(customDetails)
      expect(new CanceledError().details).toBeNull()
    })

    it('должен принимать своё сообщение и исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new CanceledError(null, {
        message: 'своё сообщение',
        cause: original,
      })

      expect(error.message).toBe('своё сообщение')
      expect(error.cause).toBe(original)
    })
  })
})
