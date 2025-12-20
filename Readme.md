# app-errors

> [!Version]
> Версия 2 оставлена для совместимости. Актуальная и поддерживаемая версия приложения - 3+.
>
> **Версии обратно не совместимы**.

Npm-пакет, предоставляющий классы ошибок приложения, связанные с обращением к внешнему API и внутренней логикой.

## Установка

```shell
npm install @andrey-aka-skif/app-errors@2
```

## Быстрый старт

```js
import { SuperagentNetworkAppError as AppError } from '@andrey-aka-skif/app-errors/superagent'

try {
  const api = new SurveysApi()
  actualData.value = await api.surveysIdChannelsChannelIdGet(
    surveyId,
    channelId,
    OPTS
  )
} catch (responseError) {
  actualData.value = []
  error.value = new AppError(toValue(responseError))
}
```

## API

- `LogicAppError` - класс, представляющий ошибки уровня логики приложения.
- `AxiosNetworkAppError` - класс, представляющий ошибки, полученные через библиотеку Axios.
- `AppErrorViaSuperagent` - класс, представляющий ошибки, полученные через библиотеку Superagent (а также через связку OpenApi Middleware + Superagent).

## Ссылки

- [История версий](CHANGELOG.md)
