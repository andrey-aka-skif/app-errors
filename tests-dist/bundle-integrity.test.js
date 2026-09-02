import { describe, expect, it } from 'vitest'
import * as src from '../src/index.js'
import { loadBrowser, loadCjs, loadEsm } from './load-bundles.js'

/**
 * Что переживает бандлер и минификатор: имена классов, ключи ERROR_TYPE и
 * цепочка прототипов. Сборщик может превратить объявление класса в присваивание
 * анонимного выражения, и тогда имя подхватывается из имени переменной, которое
 * минификатор сокращает.
 *
 * Поведение классов и билдеров сюда не заезжает — оно покрыто тестами по src/,
 * и повторять его на сборке значило бы держать два описания одного контракта.
 *
 * Каждая сборка проверяется отдельно: terser проходит по ним независимо.
 */

// Отбор по цепочке прототипов, а не по виду имени: BaseAppError отсеивается
// как не наследник самого себя, билдеры — как стрелочные функции без prototype.
const ERROR_CLASSES = Object.entries(src)
  .filter(([, value]) => value?.prototype instanceof src.BaseAppError)
  .map(([name]) => name)

const instantiate = ErrorClass => {
  try {
    return new ErrorClass()
  } catch {
    // Класс с обязательным сообщением (LogicError) без аргументов не создаётся.
    return new ErrorClass('smoke-тест')
  }
}

const bundles = [
  ['ESM', await loadEsm()],
  ['CJS', loadCjs()],
  ['IIFE', loadBrowser()],
]

describe.each(bundles)('сборка %s', (_label, bundle) => {
  it('ERROR_TYPE не разошёлся с исходником', () => {
    expect(bundle.ERROR_TYPE).toEqual(src.ERROR_TYPE)
  })

  it.each(ERROR_CLASSES)('%s сохранил имя', className => {
    expect(instantiate(bundle[className]).name).toBe(className)
  })

  it.each(ERROR_CLASSES)('%s остаётся BaseAppError', className => {
    // Сравнение с BaseAppError своей сборки: у каждой из них это свой класс.
    expect(instantiate(bundle[className])).toBeInstanceOf(bundle.BaseAppError)
  })
})
