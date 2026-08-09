import { describe, it, expect } from 'vitest'
import { AppError, LogicAppError, ErrorTypes } from '../src/index.js'

describe('LogicAppError', () => {
  it('наследуется от AppError', () => {
    const error = new LogicAppError('нарушено правило')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(LogicAppError)
  })

  it('перекрывает имя и тип базового класса', () => {
    const error = new LogicAppError('нарушено правило')

    expect(error.name).toBe('LogicAppError')
    expect(error.type).toBe(ErrorTypes.LOGIC)
  })

  it('пробрасывает сообщение и детали', () => {
    const error = new LogicAppError('Сумма не может быть отрицательной', {
      sum: -1,
    })

    expect(error.message).toBe('Сумма не может быть отрицательной')
    expect(error.detail).toEqual({ sum: -1 })
  })

  it('без деталей оставляет их пустыми', () => {
    expect(new LogicAppError('нарушено правило').detail).toBeNull()
  })

  it('без аргументов не падает', () => {
    const error = new LogicAppError()

    expect(error.message).toBe('')
    expect(error.type).toBe(ErrorTypes.LOGIC)
  })
})
