import { describe, it, expect } from 'vitest'
import { BaseAppError, NotFoundError, LogicError } from '../src/index.js'

describe('BaseAppError', () => {
  it('Должен вызывать ошибку при использовании напрямую', () => {
    expect(() => new BaseAppError()).toThrowError(
      'Экземпляр класса не должен быть создан напрямую'
    )
  })

  describe('исходная ошибка', () => {
    it('пробрасывается в штатное свойство cause', () => {
      const original = new Error('исходная')

      expect(new LogicError('обёртка', null, { cause: original }).cause).toBe(
        original
      )
    })

    it('без причины свойство cause не появляется', () => {
      // Error заводит собственное свойство cause при одном лишь наличии
      // ключа в объекте опций, независимо от значения. Пустой объект опций
      // добавил бы каждой ошибке cause со значением undefined — видимый
      // и в логах, и в любом сериализаторе.
      const error = new NotFoundError()

      expect('cause' in error).toBe(false)
      expect(error.cause).toBeUndefined()
    })

    it('причиной может быть не только Error', () => {
      const error = new NotFoundError(null, { cause: 'строка' })

      expect(error.cause).toBe('строка')
    })
  })
})
