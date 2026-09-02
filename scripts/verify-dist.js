/**
 * Smoke-тест собранного пакета.
 *
 * Проверяется ровно то, чего не видят юнит-тесты: что переживает бандлер и
 * минификатор. Это имена — набор экспортов, имена классов, ключи ERROR_TYPE —
 * и цепочка прототипов. Сборщик может превратить объявление класса в
 * присваивание анонимного выражения, и тогда имя подхватывается из имени
 * переменной, которое минификатор сокращает.
 *
 * Поведение классов и билдеров сюда не заезжает: ветвление по статусам,
 * извлечение details и устойчивость к непригодным аргументам покрыты тестами
 * по src/, и повторять их на сборке значило бы держать два описания одного
 * контракта.
 *
 * Все три сборки проверяются отдельно: terser проходит по ним независимо.
 * Грузятся они по имени пакета, а не по пути в dist, — так под проверку
 * попадает и карта exports.
 *
 * Эталон берётся из src/index.js, а не из зашитого перечня: ручной список
 * молча пропустил бы вновь добавленный класс.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'
import { createContext, runInContext } from 'node:vm'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))
const PACKAGE_NAME = '@andrey-aka-skif/app-errors'

const require = createRequire(import.meta.url)

const failures = []

const check = (condition, message) => {
  if (!condition) {
    failures.push(message)
  }
}

const report = () => {
  if (failures.length > 0) {
    console.error('❌ Проверка собранного пакета не пройдена:')
    for (const failure of failures) {
      console.error(`   - ${failure}`)
    }
    process.exit(1)
  }
}

const files = readdirSync(DIST)
check(files.includes('index.js'), 'В dist/ нет index.js')
check(files.includes('index.cjs'), 'В dist/ нет index.cjs')
check(files.includes('index.iife.js'), 'В dist/ нет index.iife.js')

// Без файлов проверять нечего: дальше их пришлось бы загружать.
report()

const src = await import('../src/index.js')

const EXPECTED_EXPORTS = Object.keys(src).sort()

// Отбор по цепочке прототипов, а не по виду имени: BaseAppError отсеивается
// как не наследник самого себя, билдеры — как стрелочные функции без prototype.
const ERROR_CLASSES = Object.entries(src)
  .filter(([, value]) => value?.prototype instanceof src.BaseAppError)
  .map(([name]) => name)

const instantiate = (label, className, ErrorClass) => {
  try {
    return new ErrorClass()
  } catch {
    // Класс с обязательным сообщением (LogicError) без аргументов не создаётся.
  }

  try {
    return new ErrorClass('smoke-тест')
  } catch (error) {
    failures.push(
      `${label}/${className}: экземпляр не создан — ${error.message}`
    )
    return null
  }
}

const verifyBundle = (label, bundle) => {
  check(
    JSON.stringify(Object.keys(bundle).sort()) ===
      JSON.stringify(EXPECTED_EXPORTS),
    `${label}: набор экспортов разошёлся с src/index.js — ${Object.keys(bundle).sort().join(', ')}`
  )

  check(
    JSON.stringify(bundle.ERROR_TYPE) === JSON.stringify(src.ERROR_TYPE),
    `${label}: ERROR_TYPE разошёлся с исходником — ${JSON.stringify(bundle.ERROR_TYPE)}`
  )

  // Проверка до цикла: без BaseAppError каждый instanceof ниже дал бы
  // TypeError вместо сообщения о причине.
  if (typeof bundle.BaseAppError !== 'function') {
    failures.push(
      `${label}: экспорт BaseAppError отсутствует, классы проверить нечем`
    )
    return
  }

  for (const className of ERROR_CLASSES) {
    const ErrorClass = bundle[className]

    if (typeof ErrorClass !== 'function') {
      failures.push(`${label}: экспорт ${className} отсутствует в сборке`)
      continue
    }

    const instance = instantiate(label, className, ErrorClass)

    if (!instance) {
      continue
    }

    check(
      instance.name === className,
      `${label}/${className}: name равен "${instance.name}" вместо "${className}"`
    )
    // Сравнение с BaseAppError своей сборки: у каждой из них это свой класс.
    check(
      instance instanceof bundle.BaseAppError,
      `${label}/${className}: экземпляр не является BaseAppError`
    )
  }
}

verifyBundle('ESM', await import(PACKAGE_NAME))

// createRequire идёт прямо к загрузчику Node: только так видно, читает он
// файл как ESM или как CJS.
verifyBundle('CJS', require(PACKAGE_NAME))

// Пустой контекст vm — без module, exports и define: те же условия, что при
// подключении тегом script.
const context = createContext({})
runInContext(
  readFileSync(require.resolve(`${PACKAGE_NAME}/browser`), 'utf8'),
  context
)

if (context.appErrors) {
  verifyBundle('IIFE', context.appErrors)
} else {
  failures.push('Браузерная сборка не объявила глобаль appErrors')
}

report()

console.log(
  '✅ Собранный пакет проверен: три сборки, точки входа, имена и наследование на месте'
)
