import { describe, it, expect } from 'vitest'
import { ErrorTypes } from '../src/index.js'

describe('ErrorTypes', () => {
  it('заморожен', () => {
    expect(Object.isFrozen(ErrorTypes)).toBe(true)
  })

  it('не позволяет изменить существующее значение', () => {
    // Модули всегда в strict mode, поэтому присваивание бросает.
    expect(() => {
      ErrorTypes.NOTFOUND = 'подмена'
    }).toThrow(TypeError)

    expect(ErrorTypes.NOTFOUND).toBe('NotFound')
  })

  it('не позволяет добавить новый ключ', () => {
    expect(() => {
      ErrorTypes.TEAPOT = 'Teapot'
    }).toThrow(TypeError)
  })

  describe('значения токенов', () => {
    // Значения токенов входят в формат хранения и уезжают в сериализацию,
    // поэтому меняются только вместе с мажорной версией пакета. Эти
    // проверки и стерегут формат от случайной правки.
    it.each([
      ['UNKNOWN', 'Unknown'],
      ['DISCONNECTED', 'Disconnected'],
      ['BADREQUEST', 'BadRequest'],
      ['UNAUTHORIZED', 'Unauthorized'],
      ['FORBIDDEN', 'Forbidden'],
      ['NOTFOUND', 'NotFound'],
      ['CONFLICT', 'Conflict'],
      ['INTERNALSERVERERROR', 'InternalServerError'],
      ['LOGIC', 'Logic'],
    ])('%s равен "%s"', (key, value) => {
      expect(ErrorTypes[key]).toBe(value)
    })

    it('не содержит ключей сверх перечисленных', () => {
      expect(Object.keys(ErrorTypes)).toHaveLength(9)
    })
  })
})
