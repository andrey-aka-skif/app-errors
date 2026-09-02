# app-errors

[![License](https://img.shields.io/github/license/andrey-aka-skif/app-errors.svg)](https://github.com/andrey-aka-skif/app-errors/blob/master/LICENSE)
[![CI](https://github.com/andrey-aka-skif/app-errors/actions/workflows/ci.yml/badge.svg)](https://github.com/andrey-aka-skif/app-errors/actions/workflows/ci.yml)
[![Publish](https://github.com/andrey-aka-skif/app-errors/actions/workflows/publish.yml/badge.svg)](https://github.com/andrey-aka-skif/app-errors/actions/workflows/publish.yml)

> [!NOTE]
> **Ветка `release/v3` — линия сопровождения.** Актуальная линия — 4.x
> в ветке `master`, и для новых проектов следует брать её.
>
> Линия 3.x развития не получает: новая функциональность в неё не вносится,
> принимаются исправления. **Версии обратно не совместимы.**

Npm-пакет, предоставляющий набор типизированных классов ошибок для Node.js и браузерных приложений. Он помогает стандартизировать обработку ошибок, связанных с обращением к внешнему API, внутренней бизнес-логикой и сетевыми проблемами.

## Установка

```shell
npm install @andrey-aka-skif/app-errors@lts-v3
```

`lts-v3` — dist-тег линии сопровождения. Он всегда указывает на последний
выпуск 3.x и не сдвигает `latest`, который принадлежит старшей версии пакета.
Годится и обычный диапазон:

```shell
npm install @andrey-aka-skif/app-errors@^3
```

Без тега команда поставит актуальную линию 4.x, несовместимую с 3.x.

## Подключение в браузере без сборщика

В пакете есть отдельная браузерная сборка `dist/index.iife.js`. Её достаточно
скопировать в статику проекта и подключить тегом — библиотека объявляет глобаль
`appErrors`:

```html
<script src="/vendor/app-errors.js"></script>
<script>
  console.log(new appErrors.NotFoundError().type)
</script>
```

Проектам со сборщиком этот файл не нужен: `import` и `require` берут ESM- и
CJS-сборки сами.

## Быстрый старт

```js
import {
  NotFoundError,
  UnauthorizedError,
  LogicError,
} from '@andrey-aka-skif/app-errors'

/*
  Документация не окончена
*/
```

## API

### Классы ошибок

- `BaseAppError` - Базовый класс для ошибок приложения, расширяющий встроенный класс Error. Добавляет пользовательские свойства: тип ошибки и дополнительные детали. Класс не должен быть создан напрямую. Прочие классы ошибок наследуются от `BaseAppError`.

- `BadRequestError` - Класс ошибки "Неверный запрос" (Bad Request). Предназначен для обработки ситуаций, когда клиент отправляет некорректные данные. Статус ошибки соответствует HTTP-коду 400.

- `ConflictError` - Класс ошибки "Конфликт" (Conflict). Предназначен для обработки ситуаций, когда запрос не может быть выполнен из-за конфликта с текущим состоянием системы. Статус ошибки соответствует HTTP-коду 409.

- `CustomError` - Класс пользовательской ошибки. Позволяет создавать ошибки с произвольным типом, сообщением и дополнительными деталями.

- `DisconnectedError` - Класс ошибки, связанной с потерей соединения. Предназначен для обработки ситуаций, когда приложение теряет связь с внешними ресурсами.

- `ForbiddenError` - Класс ошибки "Доступ запрещён" (Forbidden). Предназначен для обработки ситуаций, когда пользователь авторизован, но не имеет прав на выполнение действия. Статус ошибки соответствует HTTP-коду 403.

- `InternalServerError` - Класс ошибки "Внутренняя ошибка сервера" (Internal Server Error). Предназначен для обработки ситуаций, когда сервер столкнулся с непредвиденной ошибкой, препятствующей выполнению запроса. Статус ошибки соответствует HTTP-коду 500.

- `LogicError` - Класс ошибки логики приложения. Предназначен для обработки ошибок, связанных с логическими нарушениями в работе приложения.

- `NotFoundError` - Класс ошибки "Ресурс не найден" (Not Found). Предназначен для обработки ситуаций, когда запрашиваемый ресурс отсутствует. Статус ошибки соответствует HTTP-коду 404.

- `UnauthorizedError` - Класс ошибки "Доступ запрещён" (Unauthorized). Предназначен для обработки ситуаций, когда пользователь не авторизован или у него отсутствуют права доступа. Статус ошибки соответствует HTTP-коду 401.

- `UnknownError` - Класс ошибки "Неизвестная ошибка" (Unknown Error). Предназначен для обработки ситуаций, когда тип ошибки не может быть определён или является неожиданным.

### Типы ошибок

Перечисление `ERROR_TYPE` дублирует типизированные классы и в первую очередь используется для текстовых констант поля `message`.

```js
const ERROR_TYPE = {
  /**
   * Неизвестная ошиибка
   */
  UNKNOWN: 'Unknown',
  /**
   * Пользовательская ошибка
   */
  CUSTOM: 'Custom',
  /**
   * Сервер недоступен
   */
  DISCONNECTED: 'Disconnected',
  /**
   * 400 Bad Request
   */
  BADREQUEST: 'BadRequest',
  /**
   * 401 Unauthorized
   */
  UNAUTHORIZED: 'Unauthorized',
  /**
   * 403 Forbidden
   */
  FORBIDDEN: 'Forbidden',
  /**
   * 404 Not Found
   */
  NOTFOUND: 'NotFound',
  /**
   * 409 Conflict
   */
  CONFLICT: 'Conflict',
  /**
   * 500 Internal Server Error
   */
  INTERNALSERVERERROR: 'InternalServerError',
  /**
   * Ошибка логики приложения
   */
  LOGIC: 'Logic',
}
```

### Билдеры

- `fromAxios` - преобразование ошибок HTTP-библиотеки Axios
- `fromSuperagent` - преобразование ошибок HTTP-библиотеки Superagent

## Пример использования

```js
import { fromAxios, UnauthorizedError } from '@andrey-aka-skif/app-errors'

...

try {
  const response = await axios.post('/auth/login', { credential })
} catch (error) {
  const typedError = fromAxios(error)

  if (typedError instanceof UnauthorizedError) {
    // logout или иное необходимое действие
  }
}
```

## Ссылки

- [История версий](CHANGELOG.md)
- [Разработка и выпуск](CONTRIBUTING.md)
