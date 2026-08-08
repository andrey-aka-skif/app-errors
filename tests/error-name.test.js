import { describe, it, expect } from 'vitest'
import * as pkg from '../src/index.js'

/**
 * Имя задаётся в каждом классе строковым литералом, а не выводится из
 * имени класса. Причина: сборщик превращает объявление класса в анонимное
 * выражение, и настоящее имя теряется при минификации. Литерал минификатору
 * не по зубам — для него это просто текст.
 *
 * Здесь проверяется, что литералы не разъехались с именами экспортов.
 * Тот же инвариант на собранном пакете проверяет npm run verify:dist.
 */

/** Классы, создаваемые без обязательных аргументов. */
const NULLARY_CLASSES = [
  'UnknownError',
  'DisconnectedError',
  'TimeoutError',
  'CanceledError',
  'HttpError',
  'BadRequestError',
  'UnauthorizedError',
  'ForbiddenError',
  'NotFoundError',
  'ConflictError',
  'UnprocessableEntityError',
  'TooManyRequestsError',
  'InternalServerError',
]

describe('name у классов ошибок', () => {
  it.each(NULLARY_CLASSES)('%s задаёт собственное имя', className => {
    const error = new pkg[className]()

    expect(error.name).toBe(className)
  })

  it('CustomError задаёт собственное имя', () => {
    expect(new pkg.CustomError('TEST_TYPE').name).toBe('CustomError')
  })

  it('LogicError задаёт собственное имя', () => {
    expect(new pkg.LogicError('сообщение').name).toBe('LogicError')
  })

  it('имя попадает в первую строку стектрейса', () => {
    const error = new pkg.NotFoundError()

    expect(error.stack.split('\n')[0]).toContain('NotFoundError')
  })

  it('ни один экспортируемый класс ошибки не забыт', () => {
    // Ловит ситуацию, когда новый класс добавили, а имя проставить забыли.
    // Фильтр по PascalCase, а не по endsWith('Error'): под простую проверку
    // окончания попала бы и функция вроде statusToError, если её однажды
    // выведут в публичный экспорт.
    const covered = new Set([...NULLARY_CLASSES, 'CustomError', 'LogicError'])
    const exported = Object.keys(pkg).filter(
      key => /^[A-Z][A-Za-z]*Error$/.test(key) && key !== 'BaseAppError'
    )

    expect([...exported].sort()).toEqual([...covered].sort())
  })

  it('ни у одного класса сообщение не пустое', () => {
    // Сообщение по умолчанию задаёт каждый класс: пустая строка из
    // BaseAppError не должна доезжать до экземпляра.
    for (const className of NULLARY_CLASSES) {
      const error = new pkg[className]()

      expect(error.message).toBeTruthy()
    }
  })
})
