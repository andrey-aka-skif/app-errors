import { describe, it, expect } from 'vitest'
import {
  AppError,
  LogicAppError,
  AxiosNetworkAppError,
  SuperagentNetworkAppError,
} from '../src/index.js'

// Имя задаётся в конструкторе строковым литералом, а не выводится из имени
// класса: сборщик компилирует объявление класса в анонимное выражение, и
// настоящее имя не переживает минификацию. Здесь проверяются исходники, ту же
// пару значений в собранном пакете стережёт npm run verify:dist.
describe('name экземпляра', () => {
  it.each([
    [AppError, 'AppError'],
    [LogicAppError, 'LogicAppError'],
    // Оба сетевых класса намеренно представляются одинаково: код потребителя
    // различает их по типу ошибки, а не по источнику.
    [AxiosNetworkAppError, 'NetworkAppError'],
    [SuperagentNetworkAppError, 'NetworkAppError'],
  ])('$name равен "%s"', (ErrorClass, name) => {
    expect(new ErrorClass().name).toBe(name)
  })

  it('переживает наследование от Error', () => {
    expect(Object.prototype.toString.call(new AppError())).toBe(
      '[object Error]'
    )
  })
})
