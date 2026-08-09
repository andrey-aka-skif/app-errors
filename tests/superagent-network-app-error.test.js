import { describe, it, expect } from 'vitest'
import {
  AppError,
  SuperagentNetworkAppError,
  ErrorTypes,
} from '../src/index.js'

// Ошибка Superagent, доехавшая до разбора ответа: есть error, body,
// response и statusText. Отсутствие любого из них уводит разбор в другую ветку.
const superagentError = (status, body = null) => ({
  error: true,
  body,
  statusText: '',
  response: { status, body },
})

describe('SuperagentNetworkAppError', () => {
  it('наследуется от AppError', () => {
    const error = new SuperagentNetworkAppError()

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(SuperagentNetworkAppError)
  })

  it('без аргумента остаётся неразобранной заготовкой', () => {
    const error = new SuperagentNetworkAppError()

    expect(error.type).toBe(ErrorTypes.UNKNOWN)
    expect(error.message).toBe('')
    expect(error.detail).toBeNull()
  })

  describe('ветки разбора', () => {
    it('исключение без свойства error считается сбоем разбора ответа', () => {
      // Связка Superagent + OpenApi Middleware бросает на неожиданном формате
      // ответа (202, 208 и подобных) исключение вида "data.map is not a
      // function" — в нём свойства error нет.
      const error = new SuperagentNetworkAppError(
        new TypeError('data.map is not a function')
      )

      expect(error.type).toBe(ErrorTypes.UNKNOWN)
      expect(error.message).toBe('Ошибка при разборе ответа сервера')
    })

    it.each([
      ['body', { error: true, statusText: '', response: {} }],
      ['response', { error: true, body: null, statusText: '' }],
      ['statusText', { error: true, body: null, response: {} }],
    ])('исключение без свойства %s считается потерей связи', (_, raw) => {
      const error = new SuperagentNetworkAppError(raw)

      expect(error.type).toBe(ErrorTypes.DISCONNECTED)
      expect(error.message).toBe('Сервер недоступен')
    })

    it('полное исключение разбирается по статусу ответа', () => {
      expect(new SuperagentNetworkAppError(superagentError(404)).type).toBe(
        ErrorTypes.NOTFOUND
      )
    })
  })

  describe('непригодные аргументы', () => {
    // Класс вызывается в catch-блоках, куда прилетает что угодно. Собственное
    // падение разбора скрыло бы исходную ошибку, поэтому примитив даёт
    // обычную неизвестную ошибку, а не TypeError на операторе "in".
    it.each([
      ['строка', 'сервер прилёг'],
      ['число', 500],
      ['булево', true],
      ['символ', Symbol('сбой')],
      ['bigint', 10n],
    ])('%s не роняет разбор', (_, raw) => {
      const error = new SuperagentNetworkAppError(raw)

      expect(error.type).toBe(ErrorTypes.UNKNOWN)
      expect(error.message).toBe('Неизвестная ошибка')
    })

    it.each([
      ['null', null],
      ['undefined', undefined],
      ['пустая строка', ''],
      ['ноль', 0],
    ])('%s оставляет заготовку неразобранной', (_, raw) => {
      const error = new SuperagentNetworkAppError(raw)

      expect(error.type).toBe(ErrorTypes.UNKNOWN)
      expect(error.message).toBe('')
    })
  })

  describe('сопоставление статусов', () => {
    it.each([
      [400, ErrorTypes.BADREQUEST, 'Ошибочный формат запроса'],
      [
        401,
        ErrorTypes.UNAUTHORIZED,
        'Не хватает действительных учётных данных',
      ],
      [403, ErrorTypes.FORBIDDEN, 'Не авторизован'],
      [404, ErrorTypes.NOTFOUND, 'Ресурс не найден'],
      [409, ErrorTypes.CONFLICT, 'Ресурс уже существует'],
      [500, ErrorTypes.INTERNALSERVERERROR, 'Ошибка сервера'],
    ])('%i даёт тип %s', (status, type, message) => {
      const error = new SuperagentNetworkAppError(superagentError(status))

      expect(error.type).toBe(type)
      expect(error.message).toBe(message)
    })

    // Граница линии 2.x — та же, что у разбора axios.
    it.each([[408], [422], [429], [418], [503]])(
      '%i остаётся неизвестным, но сохраняет detail',
      status => {
        const error = new SuperagentNetworkAppError(
          superagentError(status, { detail: 'подробности' })
        )

        expect(error.type).toBe(ErrorTypes.UNKNOWN)
        expect(error.message).toBe('Неизвестная ошибка')
        expect(error.detail).toBe('подробности')
      }
    )
  })

  describe('извлечение detail', () => {
    it('берёт body.detail в первую очередь', () => {
      const error = new SuperagentNetworkAppError(
        superagentError(400, { detail: 'строчное', Detail: 'заглавное' })
      )

      expect(error.detail).toBe('строчное')
    })

    it('падает на body.Detail, когда строчного ключа нет', () => {
      const error = new SuperagentNetworkAppError(
        superagentError(400, { Detail: 'заглавное' })
      )

      expect(error.detail).toBe('заглавное')
    })

    it('без обоих ключей отдаёт тело ответа целиком', () => {
      const error = new SuperagentNetworkAppError(
        superagentError(400, { code: 'E17' })
      )

      expect(error.detail).toEqual({ code: 'E17' })
    })

    it('без тела ответа оставляет detail пустым', () => {
      expect(
        new SuperagentNetworkAppError(superagentError(400)).detail
      ).toBeNull()
    })
  })
})
