import { describe, it, expect } from 'vitest'
import { BaseAppError } from '../src/index.js'

describe('BaseAppError', () => {
  it('Должен вызывать ошибку при использовании напрямую', () => {
    expect(() => new BaseAppError()).toThrowError(
      'Экземпляр класса не должен быть создан напрямую'
    )
  })
})
