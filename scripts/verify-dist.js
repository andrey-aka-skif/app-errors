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

/** Классы, создаваемые без обязательных аргументов. */
const NULLARY_CLASSES = [
  'UnknownError',
  'DisconnectedError',
  'TimeoutError',
  'CanceledError',
  'HttpError',
  'BadRequestError',
  'UnauthorizedError',
  'ForbiddenError',
  'NotFoundError',
  'ConflictError',
  'UnprocessableEntityError',
  'TooManyRequestsError',
  'InternalServerError',
]

const failures = []

const check = (condition, message) => {
  if (!condition) {
    failures.push(message)
  }
}

const checkThrows = (fn, ErrorClass, message) => {
  try {
    fn()
    failures.push(message)
  } catch (error) {
    check(error instanceof ErrorClass, message)
  }
}

const files = readdirSync(DIST)
check(files.includes('index.es.js'), 'В dist/ нет index.es.js')
check(files.includes('index.umd.js'), 'В dist/ нет index.umd.js')

// Именно href: динамический import на Windows не принимает путь вида "D:\...".
const pkg = await import(new URL('../dist/index.es.js', import.meta.url).href)

const checkInstance = (className, instance) => {
  check(
    instance.name === className,
    `${className}: name равен "${instance.name}" вместо "${className}"`
  )
  check(
    instance instanceof pkg.BaseAppError,
    `${className}: экземпляр не является BaseAppError`
  )
}

for (const className of NULLARY_CLASSES) {
  const ErrorClass = pkg[className]

  if (!ErrorClass) {
    failures.push(`Экспорт ${className} отсутствует в сборке`)
    continue
  }

  checkInstance(className, new ErrorClass())
}

// Класс с обязательным аргументом проверяется отдельно: вызов без аргументов
// у него выбрасывает TypeError.
checkInstance('LogicError', new pkg.LogicError('дымовая проверка'))

checkThrows(
  () => new pkg.LogicError(),
  TypeError,
  'LogicError без сообщения не выбросил TypeError'
)

// Билдеры должны переживать сборку целиком, а не только по частям.
const source = {
  isAxiosError: true,
  response: { status: 404, data: { detail: 'нет такого' } },
}
const notFound = pkg.fromAxios(source)
check(
  notFound instanceof pkg.NotFoundError,
  'fromAxios не вернул NotFoundError для статуса 404'
)
check(notFound instanceof pkg.HttpError, 'NotFoundError не наследует HttpError')
check(
  notFound.details === 'нет такого',
  `fromAxios потерял details: ${JSON.stringify(notFound.details)}`
)
check(
  notFound.message === 'Not Found',
  `fromAxios потерял причинную фразу: ${notFound.message}`
)
check(notFound.cause === source, 'fromAxios не передал исходную ошибку в cause')

// Статус, для которого нет отдельного класса, должен сохраняться.
const badGateway = pkg.fromAxios({
  isAxiosError: true,
  response: { status: 502, data: { detail: 'шлюз' } },
})
check(
  badGateway instanceof pkg.HttpError && badGateway.status === 502,
  `fromAxios потерял статус 502: ${badGateway.status}`
)
check(badGateway.details === 'шлюз', 'fromAxios потерял тело ответа для 502')

check(
  pkg.fromAxios({ isAxiosError: true, code: 'ERR_CANCELED' }) instanceof
    pkg.CanceledError,
  'fromAxios не опознал отменённый запрос'
)
check(
  pkg.fromAxios({
    isAxiosError: true,
    code: 'ECONNABORTED',
    request: {},
  }) instanceof pkg.TimeoutError,
  'fromAxios не опознал таймаут'
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
