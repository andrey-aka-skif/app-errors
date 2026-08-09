import { describe, it, expect } from 'vitest'
import { AppError, ErrorTypes } from '../src/index.js'

describe('AppError', () => {
  it('наследуется от Error', () => {
    const error = new AppError()

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
  })

  it('без аргументов даёт пустое сообщение, тип Unknown и пустые детали', () => {
    const error = new AppError()

    expect(error.name).toBe('AppError')
    expect(error.message).toBe('')
    expect(error.type).toBe(ErrorTypes.UNKNOWN)
    expect(error.detail).toBeNull()
  })

  it('принимает сообщение и детали', () => {
    const error = new AppError('что-то пошло не так', { id: 7 })

    expect(error.message).toBe('что-то пошло не так')
    expect(error.detail).toEqual({ id: 7 })
  })

  it('тип не зависит от переданных аргументов', () => {
    expect(new AppError('текст', { id: 7 }).type).toBe(ErrorTypes.UNKNOWN)
  })
})
