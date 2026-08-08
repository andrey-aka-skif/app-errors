import { describe, it, expect } from 'vitest'
import {
  ERROR_TYPE,
  BaseAppError,
  HttpError,
  DisconnectedError,
} from '../src/index.js'

describe('DisconnectedError', () => {
  describe('constructor', () => {
    it('Должен быть наследником DisconnectedError и BaseAppError', () => {
      const error = new DisconnectedError()
      expect(error).toBeInstanceOf(DisconnectedError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('не является HttpError: ответа сервера нет, значит нет и статуса', () => {
      const error = new DisconnectedError()
      expect(error).not.toBeInstanceOf(HttpError)
      expect(error.status).toBeUndefined()
    })

    it('Должен иметь тип ERROR_TYPE.DISCONNECTED', () => {
      const error = new DisconnectedError()
      expect(error.type).toBe(ERROR_TYPE.DISCONNECTED)
    })

    it('Должен иметь человекочитаемое сообщение', () => {
      const error = new DisconnectedError()
      expect(error.message).toBe('Connection Failed')
    })

    it('Должен содержать переданное значение details', () => {
      const customDetails = { code: 503 }
      const error = new DisconnectedError(customDetails)
      expect(error.details).toBe(customDetails)
    })

    it('Значение свойства details по умолчанию должно быть равно null', () => {
      const error = new DisconnectedError()
      expect(error.details).toBeNull()
    })

    it('Должен принимать своё сообщение и исходную ошибку', () => {
      const original = new Error('исходная')
      const error = new DisconnectedError(null, {
        message: 'своё сообщение',
        cause: original,
      })

      expect(error.message).toBe('своё сообщение')
      expect(error.cause).toBe(original)
    })
  })
})
