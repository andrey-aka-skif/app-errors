import { describe, it, expect } from 'vitest'
import { AppError, AxiosNetworkAppError, ErrorTypes } from '../src/index.js'

const withStatus = (status, data = null) => ({ response: { status, data } })

describe('AxiosNetworkAppError', () => {
  it('наследуется от AppError', () => {
    const error = new AxiosNetworkAppError()

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AppError)
    expect(error).toBeInstanceOf(AxiosNetworkAppError)
  })

  it('без аргумента остаётся неразобранной заготовкой', () => {
    const error = new AxiosNetworkAppError()

    expect(error.type).toBe(ErrorTypes.UNKNOWN)
    expect(error.message).toBe('')
    expect(error.detail).toBeNull()
  })

  describe('ветки разбора', () => {
    it('ответ сервера разбирается по статусу', () => {
      expect(new AxiosNetworkAppError(withStatus(404)).type).toBe(
        ErrorTypes.NOTFOUND
      )
    })

    it('запрос без ответа считается потерей связи', () => {
      const error = new AxiosNetworkAppError({ request: {} })

      expect(error.type).toBe(ErrorTypes.DISCONNECTED)
      expect(error.message).toBe('Сервер недоступен')
    })

    it('ошибка без запроса и ответа считается неизвестной', () => {
      const error = new AxiosNetworkAppError({ message: 'сбой в интерсепторе' })

      expect(error.type).toBe(ErrorTypes.UNKNOWN)
      expect(error.message).toBe('Неизвестная ошибка')
      expect(error.detail).toBeNull()
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
      const error = new AxiosNetworkAppError(withStatus(status))

      expect(error.type).toBe(type)
      expect(error.message).toBe(message)
    })

    // Линия 2.x различает только перечисленные выше статусы. Остальные —
    // в том числе 408, 422 и 429, появившиеся в 4.0.0, — попадают в общую
    // ветку: тип теряется, но detail сохраняется. Набор в архивной ветке
    // расширять не планируется, и эта проверка стережёт границу линии.
    it.each([[408], [422], [429], [418], [503]])(
      '%i остаётся неизвестным, но сохраняет detail',
      status => {
        const error = new AxiosNetworkAppError(
          withStatus(status, { detail: 'подробности' })
        )

        expect(error.type).toBe(ErrorTypes.UNKNOWN)
        expect(error.message).toBe('Неизвестная ошибка')
        expect(error.detail).toBe('подробности')
      }
    )
  })

  describe('извлечение detail', () => {
    it('берёт data.detail в первую очередь', () => {
      const error = new AxiosNetworkAppError(
        withStatus(400, { detail: 'строчное', Detail: 'заглавное' })
      )

      expect(error.detail).toBe('строчное')
    })

    it('падает на data.Detail, когда строчного ключа нет', () => {
      const error = new AxiosNetworkAppError(
        withStatus(400, { Detail: 'заглавное' })
      )

      expect(error.detail).toBe('заглавное')
    })

    it('без обоих ключей отдаёт тело ответа целиком', () => {
      const error = new AxiosNetworkAppError(withStatus(400, { code: 'E17' }))

      expect(error.detail).toEqual({ code: 'E17' })
    })

    it('без тела ответа оставляет detail пустым', () => {
      expect(new AxiosNetworkAppError(withStatus(400)).detail).toBeNull()
    })
  })
})
