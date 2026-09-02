import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { createContext, runInContext } from 'node:vm'

const require = createRequire(import.meta.url)

/** Пакет резолвится по имени, а не по путям в dist: под проверку попадает и
 * сама карта exports вместе с расширениями файлов. */
export const PACKAGE_NAME = '@andrey-aka-skif/app-errors'

export const loadEsm = () => import(PACKAGE_NAME)

// createRequire идёт прямо к загрузчику Node, минуя конвейер Vite: только так
// видно, читает он файл как ESM или как CJS.
export const loadCjs = () => require(PACKAGE_NAME)

// Пустой контекст vm — без module, exports и define: те же условия, что при
// подключении тегом script.
export const loadBrowser = () => {
  const context = createContext({})

  runInContext(
    readFileSync(require.resolve(`${PACKAGE_NAME}/browser`), 'utf8'),
    context
  )

  return context.appErrors
}
