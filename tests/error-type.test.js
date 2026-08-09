import { describe, it, expect } from 'vitest'
import { ERROR_TYPE } from '../src/index.js'

describe('ERROR_TYPE', () => {
  it('заморожен', () => {
    expect(Object.isFrozen(ERROR_TYPE)).toBe(true)
  })

  it('не позволяет изменить существующее значение', () => {
    // Модули всегда в strict mode, поэтому присваивание бросает.
    expect(() => {
      ERROR_TYPE.NOT_FOUND = 'подмена'
    }).toThrow(TypeError)

    expect(ERROR_TYPE.NOT_FOUND).toBe('NotFound')
  })

  it('не позволяет добавить новый ключ', () => {
    expect(() => {
      ERROR_TYPE.TEAPOT = 'Teapot'
    }).toThrow(TypeError)
  })

  describe('значения токенов', () => {
    // Значения токенов входят в формат хранения и уезжают в сериализацию,
    // поэтому меняются только вместе с мажорной версией пакета. Эти
    // проверки и стерегут формат от случайной правки.
    it.each([
      ['UNKNOWN', 'Unknown'],
      ['LOGIC', 'Logic'],
      ['DISCONNECTED', 'Disconnected'],
      ['TIMEOUT', 'Timeout'],
      ['CANCELED', 'Canceled'],
      ['HTTP', 'Http'],
      ['BAD_REQUEST', 'BadRequest'],
      ['UNAUTHORIZED', 'Unauthorized'],
      ['FORBIDDEN', 'Forbidden'],
      ['NOT_FOUND', 'NotFound'],
      ['CONFLICT', 'Conflict'],
      ['UNPROCESSABLE_ENTITY', 'UnprocessableEntity'],
      ['TOO_MANY_REQUESTS', 'TooManyRequests'],
      ['INTERNAL_SERVER_ERROR', 'InternalServerError'],
    ])('%s равен "%s"', (key, value) => {
      expect(ERROR_TYPE[key]).toBe(value)
    })

    it('не содержит ключей сверх перечисленных', () => {
      expect(Object.keys(ERROR_TYPE)).toHaveLength(14)
    })
  })
})
