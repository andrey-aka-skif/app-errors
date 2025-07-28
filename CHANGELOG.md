# Журнал изменений

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Этот проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Не выпущено]

## [3.0.0-alpha.2] - 2025-07-28

### Добавлено

- Типизированные ошибки:
  - `BadRequestError`,
  - `ConflictError`,
  - `DisconnectedError`,
  - `ForbiddenError`,
  - `InternalServerError`,
  - `LogicError`,
  - `NotFoundError`,
  - `UnauthorizedError`,
  - `UnknownError`.
- Билдер типизированных ошибок на основе библиотеки `axios`.
- Билдер типизированных ошибок на основе библиотеки `superagent`.
- Документация по кастомным ошибкам в `README.md`

### Изменено

- **BREAKING CHANGE**: Классы ошибок больше не содержат логику парсинга ответов (перенесено в билдеры).
- **BREAKING CHANGE**: Удалена прямая зависимость от конкретных HTTP-библиотек (теперь используются билдеры).
- **BREAKING CHANGE**: Вместо обобщенного класса ошибки добавлен набор типизированных ошибок.

### Удалено

- Устаревшие классы `AppErrorViaAxios` и `AppErrorViaSuperagent` (заменены на билдеры).

## [2.0.0] - 2024-11-06

### Добавлено

- Классы для обработки сетевых ошибок:
  - `AxiosNetworkAppError` (для `axios`).
  - `SuperagentNetworkAppError` (для `superagent` и `OpenAPI Middleware`).
- Класс `LogicAppError` для бизнес-логики приложения.

### Изменено

- **BREAKING CHANGE**: Переход на сборку через `Vite` (вместо Babel).
- Рефакторинг базового класса `AppError` (теперь не содержит логики парсинга).

## [1.0.0] - 2023-09-28

### Добавлено

- Базовый класс `AppError` с парсингом HTTP-ошибок.
- Заглушки для интеграции:
  - `AppErrorViaAxios` (требует реализации).
  - `AppErrorViaSuperagent` (аналогично).
- Первоначальная документация.
