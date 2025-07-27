import { describe, it, expect } from 'vitest'
import { ERROR_TYPE, BaseAppError, DisconnectedError } from '../src/index.js'

describe('DisconnectedError', () => {
  describe('constructor', () => {
    it('Должен быть наследником  DisconnectedError и BaseAppError', () => {
      const error = new DisconnectedError()
      expect(error).toBeInstanceOf(DisconnectedError)
      expect(error).toBeInstanceOf(BaseAppError)
    })

    it('Должен иметь тип type ERROR_TYPE.DISCONNECTED и message Сервер недоступен', () => {
      const error = new DisconnectedError()
      expect(error.type).toBe(ERROR_TYPE.DISCONNECTED)
      expect(error.message).toBe(ERROR_TYPE.DISCONNECTED)
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
  })
})
