/**
 * Дымовая проверка собранного пакета.
 *
 * Юнит-тесты гоняются по src/ и не видят того, что делают с кодом бандлер и
 * минификатор. Именно там ломаются имена классов: сборщик может превратить
 * объявление класса в присваивание анонимного выражения, и тогда имя
 * подхватывается из имени переменной, которое минификатор сокращает.
 * Проверяем то, что реально уезжает потребителю, — обе сборки, ESM и UMD:
 * terser проходит по каждой отдельно.
 *
 * Эталон берётся из src/index.js, а не из зашитого перечня: ручной список
 * молча пропустил бы вновь добавленный класс.
 */

import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

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
check(files.includes('index.umd.js'), 'В dist/ нет index.umd.js')

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
    return new ErrorClass('дымовая проверка')
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
    // Сравнение с BaseAppError своей сборки: у ESM и UMD это разные классы.
    check(
      instance instanceof bundle.BaseAppError,
      `${label}/${className}: экземпляр не является BaseAppError`
    )
  }

  // Билдеры должны переживать сборку целиком, а не только по частям.
  // Логика их ветвления проверена юнит-тестами по src/.
  check(
    bundle.fromAxios({
      isAxiosError: true,
      response: { status: 404, data: { detail: 'нет такого' } },
    }) instanceof bundle.NotFoundError,
    `${label}: fromAxios не вернул NotFoundError для статуса 404`
  )
  check(
    bundle.fromSuperagent(null) instanceof bundle.UnknownError,
    `${label}: fromSuperagent не устоял на аргументе null`
  )
}

// Именно href: динамический import на Windows не принимает путь вида "D:\...".
verifyBundle(
  'ESM',
  await import(new URL('../dist/index.es.js', import.meta.url).href)
)

// UMD-сборка не экспортирует ничего по-модульному: при загрузке она кладёт
// экспорты в globalThis под именем из build.lib.name.
await import(new URL('../dist/index.umd.js', import.meta.url).href)

if (globalThis.appErrors) {
  verifyBundle('UMD', globalThis.appErrors)
} else {
  failures.push('UMD-сборка не завела globalThis.appErrors')
}

report()

console.log(
  '✅ Собранный пакет проверен: обе сборки, имена классов и билдеры на месте'
)
