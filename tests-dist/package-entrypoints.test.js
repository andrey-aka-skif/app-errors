import { describe, expect, it } from 'vitest'
import * as src from '../src/index.js'
import { loadBrowser, loadCjs, loadEsm } from './load-bundles.js'

/**
 * Точки входа опубликованного пакета: что отдаёт карта exports каждому из
 * способов загрузки. Юнит-тесты этого не видят — они идут по src/, а импорты
 * им резолвит Vite, а не загрузчик Node.
 */

const EXPECTED_EXPORTS = Object.keys(src).sort()

describe('точки входа собранного пакета', () => {
  it('import отдаёт публичные экспорты', async () => {
    expect(Object.keys(await loadEsm()).sort()).toEqual(EXPECTED_EXPORTS)
  })

  it('require отдаёт публичные экспорты', () => {
    expect(Object.keys(loadCjs()).sort()).toEqual(EXPECTED_EXPORTS)
  })

  it('браузерная сборка объявляет глобаль appErrors', () => {
    expect(Object.keys(loadBrowser()).sort()).toEqual(EXPECTED_EXPORTS)
  })
})
