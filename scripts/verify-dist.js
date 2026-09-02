/**
 * Smoke-тест собранного пакета.
 *
 * Проверяется ровно то, чего не видят юнит-тесты: что переживает бандлер и
 * минификатор. Это имена — набор экспортов, имена классов, ключи ErrorTypes —
 * и цепочка прототипов. Сборщик может превратить объявление класса в
 * присваивание анонимного выражения, и тогда имя подхватывается из имени
 * переменной, которое минификатор сокращает.
 *
 * Поведение классов сюда не заезжает: ветвление по статусам, извлечение detail
 * и устойчивость к непригодным аргументам покрыты тестами по src/, и повторять
 * их на сборке значило бы держать два описания одного контракта.
 *
 * Обе сборки проверяются отдельно: terser проходит по ESM и UMD независимо.
 * Грузятся они по имени пакета, а не по пути в dist, — так под проверку
 * попадает и карта exports.
 *
 * Эталон берётся из src/index.js, а не из зашитого перечня: ручной список
 * молча пропустил бы вновь добавленный класс.
 */

import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath, URL } from 'node:url'

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
check(files.includes('index.es.js'), 'В dist/ нет index.es.js')
check(files.includes('index.umd.cjs'), 'В dist/ нет index.umd.cjs')

// Без файлов проверять нечего: дальше их пришлось бы загружать.
report()

const src = await import('../src/index.js')

const EXPECTED_EXPORTS = Object.keys(src).sort()

// Отбор по цепочке прототипов, а не по виду имени: AppError отсеивается как
// не наследник самого себя и проверяется отдельно.
const ERROR_CLASSES = Object.entries(src)
  .filter(([, value]) => value?.prototype instanceof src.AppError)
  .map(([name]) => name)

// Имена сверяются с исходником, а не с именем класса: оба сетевых класса
// намеренно представляются как NetworkAppError, и сверка с именем класса дала
// бы ложное срабатывание.
const EXPECTED_NAMES = Object.fromEntries(
  ['AppError', ...ERROR_CLASSES].map(className => [
    className,
    new src[className]().name,
  ])
)

const verifyBundle = (label, bundle) => {
  check(
    JSON.stringify(Object.keys(bundle).sort()) ===
      JSON.stringify(EXPECTED_EXPORTS),
    `${label}: набор экспортов разошёлся с src/index.js — ${Object.keys(bundle).sort().join(', ')}`
  )

  // Ключи ErrorTypes — такие же имена, как имена классов, и точно так же
  // теряются при включённом mangle.properties.
  check(
    JSON.stringify(bundle.ErrorTypes) === JSON.stringify(src.ErrorTypes),
    `${label}: ErrorTypes разошёлся с исходником — ${JSON.stringify(bundle.ErrorTypes)}`
  )

  // Проверка до цикла: без AppError каждый instanceof ниже дал бы TypeError
  // вместо сообщения о причине.
  if (typeof bundle.AppError !== 'function') {
    failures.push(
      `${label}: экспорт AppError отсутствует, классы проверить нечем`
    )
    return
  }

  for (const className of ['AppError', ...ERROR_CLASSES]) {
    const ErrorClass = bundle[className]

    if (typeof ErrorClass !== 'function') {
      failures.push(`${label}: экспорт ${className} отсутствует в сборке`)
      continue
    }

    // Все классы ошибок допускают нульарный вызов.
    const instance = new ErrorClass()

    check(
      instance.name === EXPECTED_NAMES[className],
      `${label}/${className}: name равен "${instance.name}" вместо "${EXPECTED_NAMES[className]}"`
    )
    // Цепочка прототипов — второе, что рвётся при сборке: наследование
    // компилируется, и потерянное звено видно только на собранном классе.
    // Сравнение с AppError своей сборки: у ESM и CJS это разные классы.
    check(
      instance instanceof bundle.AppError,
      `${label}/${className}: экземпляр не является AppError`
    )
  }
}

verifyBundle('ESM', await import(PACKAGE_NAME))

// createRequire идёт прямо к загрузчику Node: только так видно, читает он
// файл как ESM или как CJS.
verifyBundle('CJS', require(PACKAGE_NAME))

report()

console.log(
  '✅ Собранный пакет проверен: обе сборки, точки входа, имена и наследование на месте'
)
