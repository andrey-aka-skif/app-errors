/**
 * Дымовая проверка собранного пакета.
 *
 * Юнит-тесты гоняются по src/ и не видят того, что делают с кодом бандлер и
 * минификатор. Именно там ломаются имена классов: сборщик может превратить
 * объявление класса в присваивание анонимного выражения, и тогда имя
 * подхватывается из имени переменной, которое минификатор сокращает.
 * Проверяем то, что реально уезжает потребителю.
 */

import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const DIST = fileURLToPath(new URL('../dist', import.meta.url))

/** Классы, для которых имя должно совпадать с именем экспорта. */
const ERROR_CLASSES = [
  'UnknownError',
  'CustomError',
  'LogicError',
  'DisconnectedError',
  'BadRequestError',
  'UnauthorizedError',
  'ForbiddenError',
  'NotFoundError',
  'ConflictError',
  'InternalServerError',
]

const failures = []

const check = (condition, message) => {
  if (!condition) {
    failures.push(message)
  }
}

const files = readdirSync(DIST)
check(files.includes('index.es.js'), 'В dist/ нет index.es.js')
check(files.includes('index.umd.js'), 'В dist/ нет index.umd.js')

// Именно href: динамический import на Windows не принимает путь вида "D:\...".
const pkg = await import(new URL('../dist/index.es.js', import.meta.url).href)

for (const className of ERROR_CLASSES) {
  const ErrorClass = pkg[className]

  if (!ErrorClass) {
    failures.push(`Экспорт ${className} отсутствует в сборке`)
    continue
  }

  const instance = new ErrorClass()

  check(
    instance.name === className,
    `${className}: name равен "${instance.name}" вместо "${className}"`
  )
  check(
    instance instanceof pkg.BaseAppError,
    `${className}: экземпляр не является BaseAppError`
  )
}

// Билдеры должны переживать сборку целиком, а не только по частям.
const notFound = pkg.fromAxios({
  isAxiosError: true,
  response: { status: 404, data: { detail: 'нет такого' } },
})
check(
  notFound instanceof pkg.NotFoundError,
  'fromAxios не вернул NotFoundError для статуса 404'
)
check(
  notFound.details === 'нет такого',
  `fromAxios потерял details: ${JSON.stringify(notFound.details)}`
)

check(
  pkg.fromAxios(null) instanceof pkg.UnknownError,
  'fromAxios не устоял на аргументе null'
)
check(
  pkg.fromSuperagent(null) instanceof pkg.UnknownError,
  'fromSuperagent не устоял на аргументе null'
)

if (failures.length > 0) {
  console.error('❌ Проверка собранного пакета не пройдена:')
  for (const failure of failures) {
    console.error(`   - ${failure}`)
  }
  process.exit(1)
}

console.log('✅ Собранный пакет проверен: имена классов и билдеры на месте')
