# Журнал изменений

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/).
Этот проект придерживается [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Не выпущено] - 2025-12-20

### Изменено

- Рефакторинг конфигурационных файлов проекта
- Обновлен README
- Добавлен CHANGELOG

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