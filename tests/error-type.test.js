import { describe, it, expect } from 'vitest'
import { ERROR_TYPE } from '../src/index.js'

describe('ERROR_TYPE', () => {
  it('заморожен', () => {
    expect(Object.isFrozen(ERROR_TYPE)).toBe(true)
  })

  it('не позволяет изменить существующее значение', () => {
    // Модули всегда в strict mode, поэтому присваивание бросает.
    expect(() => {
      ERROR_TYPE.NOTFOUND = 'подмена'
    }).toThrow(TypeError)

    expect(ERROR_TYPE.NOTFOUND).toBe('NotFound')
  })

  it('не позволяет добавить новый ключ', () => {
    expect(() => {
      ERROR_TYPE.TEAPOT = 'Teapot'
    }).toThrow(TypeError)
  })
})
