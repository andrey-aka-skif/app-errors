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

  describe('перечислимость полей', () => {
    it('копия ошибки содержит текст, тип, детали, имя и статус', () => {
      // Один набор ключей стережёт обе стороны контракта: message в копию
      // попадает, cause и stack — нет.
      const error = new NotFoundError({ id: 7 }, { message: 'Заказ не найден' })

      expect(Object.keys(error)).toEqual([
        'message',
        'type',
        'details',
        'name',
        'status',
      ])
    })

    it('текст ошибки переживает спред', () => {
      const error = new NotFoundError({ id: 7 }, { message: 'Заказ не найден' })

      expect({ ...error }.message).toBe('Заказ не найден')
    })

    it('текст ошибки переживает JSON.stringify', () => {
      const error = new NotFoundError({ id: 7 }, { message: 'Заказ не найден' })

      expect(JSON.parse(JSON.stringify(error))).toEqual({
        message: 'Заказ не найден',
        type: 'NotFound',
        details: { id: 7 },
        name: 'NotFoundError',
        status: 404,
      })
    })

    it('сообщение по умолчанию сериализуется наравне с кастомным', () => {
      expect(JSON.parse(JSON.stringify(new NotFoundError())).message).toBe(
        'Not Found'
      )
    })

    it('текст сериализуется и у класса с обязательным сообщением', () => {
      const error = new LogicError('Сумма заказа не может быть отрицательной')

      expect(JSON.parse(JSON.stringify(error)).message).toBe(
        'Сумма заказа не может быть отрицательной'
      )
    })

    it('сообщение остаётся доступным для записи', () => {
      const error = new NotFoundError()

      error.message = 'другое'

      expect(error.message).toBe('другое')
    })

    it('причина в копию не попадает, но доступна прямым обращением', () => {
      // Перечислимый cause затащил бы в сериализацию граф исходной ошибки
      // целиком: у обычного Error собственные поля неперечислимы и текст
      // всё равно теряется, ответ superagent даёт цикл и роняет
      // JSON.stringify, а ошибка axios вывозит config вместе с заголовками
      // запроса. Кому нужен текст причины в копии — берёт его явно:
      // { ...error, causeMessage: error.cause?.message }.
      const original = new Error('исходная')
      const error = new NotFoundError(null, { cause: original })

      expect(Object.keys(error)).not.toContain('cause')
      expect(JSON.parse(JSON.stringify(error)).cause).toBeUndefined()
      expect(error.cause).toBe(original)
    })
  })
})
