# Линии выпуска

Пакет развивается в одной ветке, а выпущенные мажорные версии продолжают жить
в отдельных ветках сопровождения. Этот сайт собирается только из `master`,
поэтому справочник API описывает актуальную линию — для остальных источником
служат журнал изменений и исходники соответствующей ветки.

| Линия | Ветка                                                                       | Последний выпуск                                                                         | dist-tag |
| ----- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------- |
| 4.x   | [master](https://github.com/andrey-aka-skif/app-errors/tree/master)         | [4.0.1](https://github.com/andrey-aka-skif/app-errors/releases/tag/v4.0.1) от 09.08.2026 | `latest` |
| 3.x   | [release/v3](https://github.com/andrey-aka-skif/app-errors/tree/release/v3) | [3.2.2](https://github.com/andrey-aka-skif/app-errors/releases/tag/v3.2.2) от 09.08.2026 | `v3-lts` |
| 2.x   | [release/v2](https://github.com/andrey-aka-skif/app-errors/tree/release/v2) | [2.1.1](https://github.com/andrey-aka-skif/app-errors/releases/tag/v2.1.1) от 09.08.2026 | `v2-lts` |

Все три линии требуют Node.js 22 или новее и отдают ESM и UMD одинаковым набором
условных экспортов; линия 2.x дополнительно сохраняет подпути `./error-types`,
`./logic`, `./axios` и `./superagent` — они ведут в тот же бандл и в 3.x убраны.

## Установка версии из линии сопровождения

Актуальная версия ставится обычным образом — она помечена `latest`:

```shell
npm install @andrey-aka-skif/app-errors
```

Линии сопровождения ставятся по dist-tag или по диапазону версий:

```shell
npm install @andrey-aka-skif/app-errors@v3-lts
```

```shell
npm install @andrey-aka-skif/app-errors@^3
```

## Как выбирается dist-tag

Метку назначает workflow публикации, а не человек, и делает это по одному
правилу: `latest` достаётся только старшей версии среди всех тегов репозитория.

- тег старше всех остальных → `latest`;
- предрелиз (GitHub Release помечен как pre-release) → `next`;
- тег не старший, то есть патч линии сопровождения → `<мажор>-lts`, например
  `v3-lts`;
- ручной запуск workflow без указания метки → `replay`.

Смысл правила в том, что патч старой линии, выпущенный после новой мажорной
версии, иначе увёл бы `latest` назад: `npm install` без уточнений начал бы
ставить 3.x после выхода 4.0. Метка `replay` служит той же цели при
пересборке и переиздании уже выпущенной версии — она паркует публикацию, не
трогая `latest`.

## Переход между линиями

Ломающие изменения версии 4.0 и порядок перехода с 3.x описаны в разделе
«Миграция 3.x → 4.0» [обзора](./index.md#миграция-3-x-→-4-0). Полный перечень
изменений по каждой линии — в журнале изменений соответствующей ветки:
[master](https://github.com/andrey-aka-skif/app-errors/blob/master/CHANGELOG.md),
[release/v3](https://github.com/andrey-aka-skif/app-errors/blob/release/v3/CHANGELOG.md),
[release/v2](https://github.com/andrey-aka-skif/app-errors/blob/release/v2/CHANGELOG.md).
