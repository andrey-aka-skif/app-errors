# app-errors

[![License](https://img.shields.io/github/license/andrey-aka-skif/app-errors.svg)](https://github.com/andrey-aka-skif/app-errors/blob/master/LICENSE)
[![CI](https://github.com/andrey-aka-skif/app-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/andrey-aka-skif/app-errors/actions/workflows/ci.yml)
[![Publish](https://github.com/andrey-aka-skif/app-errors/actions/workflows/publish.yml/badge.svg)](https://github.com/andrey-aka-skif/app-errors/actions/workflows/publish.yml)

Npm-пакет, предоставляющий набор типизированных классов ошибок для Node.js и браузерных приложений. Он помогает стандартизировать обработку ошибок, связанных с обращением к внешнему API, внутренней бизнес-логикой и сетевыми проблемами.

## Установка

Пакет публикуется в GitHub Packages, поэтому scope `@andrey-aka-skif` нужно направить на соответствующий реестр. В `.npmrc` проекта:

```ini
@andrey-aka-skif:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Токену достаточно права `read:packages`.

```shell
npm install @andrey-aka-skif/app-errors
```

> Поле `version` в `package.json` репозитория всегда равно `0.0.0` — это заглушка, а не ошибка. Реальную версию проставляет CI при публикации, беря её из git-тега вида `v1.2.3`. В опубликованном пакете версия корректная.

## Быстрый старт

Ошибка HTTP-клиента приводится билдером к типизированной ошибке приложения, дальше ветвление строится по `instanceof`:

```js
import {
  fromAxios,
  HttpError,
  UnauthorizedError,
  NotFoundError,
  TimeoutError,
  CanceledError,
  DisconnectedError,
} from '@andrey-aka-skif/app-errors'

try {
  const response = await axios.get(`/api/orders/${id}`)
  return response.data
} catch (error) {
  const appError = fromAxios(error)

  if (appError instanceof UnauthorizedError) {
    return logout()
  }

  if (appError instanceof NotFoundError) {
    return null
  }

  if (appError instanceof CanceledError) {
    return
  }

  if (
    appError instanceof TimeoutError ||
    appError instanceof DisconnectedError
  ) {
    return showRetryBanner()
  }

  if (appError instanceof HttpError) {
    // Статус доступен и тогда, когда для него нет отдельного класса
    log(`Сервер ответил ${appError.status}`, appError.details)
  }

  throw appError
}
```

Билдеры не выбрасывают исключений и всегда возвращают экземпляр одного из классов пакета, поэтому вызов внутри `catch` безопасен. Исходная ошибка библиотеки сохраняется в стандартном свойстве `cause` — из неё доступны URL, метод, заголовки и исходный стектрейс:

```js
const appError = fromAxios(error)

console.error(appError.name, appError.type, appError.message)
console.error(appError.details) // тело ответа сервера
console.error(appError.cause) // исходная ошибка Axios
```

Собственные ошибки приложения создаются напрямую:

```js
import { LogicError, ERROR_TYPE } from '@andrey-aka-skif/app-errors'

if (order.total < 0) {
  throw new LogicError('Сумма заказа не может быть отрицательной', {
    orderId: order.id,
  })
}
```

Тип у `LogicError` зашит — это всегда `ERROR_TYPE.LOGIC`. Собственная классификация прикладных ошибок, если она нужна, живёт в `details`: пакет туда не заглядывает и формы не требует.

Для ветвления в коде используется `instanceof`, для сериализации и сравнения — поле `type`:

```js
if (appError.type === ERROR_TYPE.NOT_FOUND) {
  /* ... */
}
```

Сообщение (`message`) человекочитаемо и может быть переопределено вызывающей стороной, поэтому дискриминатором не является.

## API

### Иерархия классов

```
Error
└─ BaseAppError                       абстрактный, прямое создание запрещено
   ├─ UnknownError
   ├─ LogicError
   ├─ DisconnectedError
   ├─ TimeoutError
   ├─ CanceledError
   └─ HttpError                       несёт HTTP-статус в поле status
      ├─ BadRequestError              400
      ├─ UnauthorizedError            401
      ├─ ForbiddenError               403
      ├─ NotFoundError                404
      ├─ ConflictError                409
      ├─ UnprocessableEntityError     422
      ├─ TooManyRequestsError         429
      └─ InternalServerError          500
```

### Свойства экземпляра

| Свойство  | Описание                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `name`    | Имя класса ошибки                                                                                      |
| `type`    | Значение из `ERROR_TYPE`; единственный сериализуемый дискриминатор                                     |
| `message` | Человекочитаемое сообщение; может быть переопределено                                                  |
| `details` | Дополнительные детали: тело ответа сервера или произвольные данные; по умолчанию `null`                |
| `status`  | HTTP-статус ответа; только у `HttpError` и его наследников                                             |
| `cause`   | Исходная ошибка. Свойство отсутствует, если причина не передавалась; в копию перечислением не попадает |

### Копирование и сериализация

Ошибка переживает копирование перечислением собственных свойств — и спред, и `JSON.stringify` сохраняют текст:

```js
const error = new NotFoundError({ id: 7 }, { message: 'Заказ не найден' })

JSON.stringify(error)
// {"message":"Заказ не найден","type":"NotFound","details":{"id":7},"name":"NotFoundError","status":404}

const record = { ...error, level: 'error' } // message на месте
```

`cause` и `stack` в копию не попадают: причина — это граф объектов, и перечислимость затащила бы его в сериализацию целиком. Ошибка Axios вывезла бы вместе с `config` заголовки запроса, ответ Superagent — циклическую ссылку, на которой `JSON.stringify` выбрасывает исключение. Прямому обращению это не мешает: `error.cause`, `error.cause.stack` и цепочка причин в `console.error(error)` работают как обычно. Если текст причины нужен именно в копии, он берётся явно:

```js
const record = { ...error, causeMessage: error.cause?.message }
```

### Классы ошибок

- `BaseAppError` — базовый класс, расширяющий встроенный `Error`. Абстрактный: прямое создание выбрасывает исключение. Используется для проверки «это ошибка нашего пакета».

- `HttpError(status, details = null, { type, message, cause } = {})` — ошибка ответа сервера. Головной класс семейства статусов, создаётся напрямую, когда для статуса нет отдельного класса. Сообщение по умолчанию выводится из статуса: для известных статусов — причинная фраза (`503` → `Service Unavailable`), для прочих целых — `HTTP <статус>`.

Классы конкретных статусов принимают одинаковые аргументы — `(details = null, { message, cause } = {})`:

- `BadRequestError` — 400 Bad Request. Клиент отправил некорректные данные.
- `UnauthorizedError` — 401 Unauthorized. Пользователь не аутентифицирован.
- `ForbiddenError` — 403 Forbidden. Пользователь аутентифицирован, но прав недостаточно.
- `NotFoundError` — 404 Not Found. Запрашиваемый ресурс отсутствует.
- `ConflictError` — 409 Conflict. Запрос конфликтует с текущим состоянием системы.
- `UnprocessableEntityError` — 422 Unprocessable Entity. Запрос синтаксически корректен, но не может быть обработан.
- `TooManyRequestsError` — 429 Too Many Requests. Превышен лимит обращений.
- `InternalServerError` — 500 Internal Server Error. Непредвиденная ошибка на стороне сервера.

Ошибки, не связанные с ответом сервера, — та же сигнатура `(details = null, { message, cause } = {})`, поля `status` у них нет:

- `DisconnectedError` — связь с сервером не установлена.
- `TimeoutError` — истекло время ожидания ответа.
- `CanceledError` — запрос отменён вызывающей стороной.
- `UnknownError` — тип ошибки определить не удалось.

Особая сигнатура:

- `LogicError(message, details = null, { cause } = {})` — нарушенное прикладное правило или инвариант. Единственный класс, который не порождают билдеры: его создаёт само приложение там, где правило проверено. Сообщение обязательно и передаётся первым позиционным аргументом — осмысленный текст здесь может задать только вызывающая сторона; пустое значение или не строка дают `TypeError`.

### Типы ошибок

Перечисление `ERROR_TYPE` — набор машинных токенов, попадающих в сериализацию. Тип служит дискриминатором ошибки при передаче за пределы процесса: там, где `instanceof` недоступен, ветвление строится по `type`, а не по сообщению.

```js
const ERROR_TYPE = {
  UNKNOWN: 'Unknown',
  LOGIC: 'Logic',
  DISCONNECTED: 'Disconnected',
  TIMEOUT: 'Timeout',
  CANCELED: 'Canceled',
  HTTP: 'Http',
  BAD_REQUEST: 'BadRequest',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'NotFound',
  CONFLICT: 'Conflict',
  UNPROCESSABLE_ENTITY: 'UnprocessableEntity',
  TOO_MANY_REQUESTS: 'TooManyRequests',
  INTERNAL_SERVER_ERROR: 'InternalServerError',
}
```

Объект заморожен: попытка изменить или дополнить его выбрасывает `TypeError` в строгом режиме.

### Билдеры

Билдеры приводят ошибку HTTP-библиотеки к классу пакета. Оба никогда не выбрасывают исключений — любой непригодный для разбора аргумент даёт `UnknownError` — и на каждой ветке кладут исходную ошибку в `cause`.

- `fromAxios(error)` — преобразование ошибок [Axios](https://axios-http.com/). Порядок разбора: ответ сервера (`error.response`) → отмена (`code === 'ERR_CANCELED'`) → таймаут (`code` из `ECONNABORTED`, `ETIMEDOUT`) → обрыв связи (`code === 'ERR_NETWORK'` либо запрос без ответа) → `UnknownError`.

- `fromSuperagent(error)` — преобразование ошибок [Superagent](https://forwardemail.github.io/superagent/). Порядок разбора: таймаут (`error.timeout`) → исключение, не являющееся ошибкой Superagent (нет свойства `error`) → обрыв связи (нет `body`, `response` или `statusText`) → ответ сервера.

Ответ сервера отображается в класс по статусу; статус без отдельного класса даёт обобщённый `HttpError` с сохранёнными `status` и телом ответа:

```js
// Сервер ответил 502
const appError = fromAxios(error)

appError instanceof HttpError // true
appError.type // 'Http'
appError.status // 502
appError.message // 'Bad Gateway'
```

Тело ответа попадает в `details`. Axios берётся из `response.data`, Superagent — из `response.body`; внутри тела приоритет такой: `detail`, затем `Detail`, затем всё тело целиком, иначе `null`.

## Миграция 3.x → 4.0

Версия 4.0 содержит ломающие изменения.

**Ключи `ERROR_TYPE` переведены в SCREAMING_SNAKE.** Значения токенов не изменились, поэтому сохранённые данные пересчитывать не нужно — правки требуются только в коде.

| 3.x                   | 4.0                     |
| --------------------- | ----------------------- |
| `BADREQUEST`          | `BAD_REQUEST`           |
| `NOTFOUND`            | `NOT_FOUND`             |
| `INTERNALSERVERERROR` | `INTERNAL_SERVER_ERROR` |

**Поле `message` больше не равно машинному токену.** Было `NotFound`, стало `Not Found`. Код, сравнивавший `message` с токеном, нужно перевести на `instanceof` или на `type`.

**Статус без отдельного класса даёт `HttpError`, а не `UnknownError`.** Ответы 418, 502, 503, 504 и прочие теперь сохраняют `status` и тело ответа. Ветки вида `instanceof UnknownError` для ошибок сервера следует пересмотреть: `UnknownError` остаётся только для того, что разобрать не удалось.

**Таймаут и отмена выделены в отдельные классы.** Раньше таймаут был неотличим от обрыва связи, а отмена запроса уходила в `DisconnectedError` или `UnknownError`. Теперь это `TimeoutError` и `CanceledError` — обе наследуются от `BaseAppError`, но не от `HttpError`.

**Класс `CustomError` удалён вместе с токеном `ERROR_TYPE.CUSTOM`.** Он был единственным местом, где в `type` попадала произвольная строка, и из-за него перечисление не было исчерпывающим для того, кто ошибку читает. Прикладную ошибку закрывает `LogicError`: `new CustomError('PERMISSION_DENIED', { requiredRole: 'admin' })` становится `new LogicError('Недостаточно прав', { requiredRole: 'admin' })`. Первый аргумент `CustomError` был токеном приложения, а не пакета; если он нужен для ветвления, ему место в `details`, в поле, которое приложение назовёт само.

**Обязательные параметры теперь проверяются.** `LogicError` без сообщения выбрасывает `TypeError` вместо создания ошибки с пустыми полями.

**Кастомное сообщение доступно у любого класса** — вторым параметром-опцией: `new NotFoundError(details, { message: 'Заказ не найден' })`. Тип при этом не меняется.

## Ссылки

- [История версий](CHANGELOG.md)
