import { OptionDefaults } from 'typedoc'

import ERROR_TYPE from '../src/error-type.js'

// Страница перечисления в сгенерированном справочнике. Отдельных страниц
// у ключей нет — все ссылки вида {@link ERROR_TYPE.NOT_FOUND} ведут сюда.
const ERROR_TYPE_PAGE = '/api/variables/ERROR_TYPE'

/** @type {Partial<import('typedoc').TypeDocOptions>} */
export default {
  plugin: ['typedoc-plugin-markdown', 'typedoc-vitepress-theme'],

  entryPoints: ['../src/index.js'],
  tsconfig: './tsconfig.json',

  out: './api',
  docsRoot: './',

  name: 'API',
  // Версия в манифесте всегда 0.0.0 — заголовок с ней врал бы.
  includeVersion: false,
  // Обзор отдаёт VitePress, дублировать его в справочнике незачем.
  readme: 'none',

  // Классы размечены в стиле JSDoc, где конструктор помечается тегом явно.
  // TypeDoc определяет конструктор по коду и такого тега не знает.
  blockTags: [...OptionDefaults.blockTags, '@constructor'],

  externalSymbolLinkMappings: {
    typescript: {
      Error:
        'https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error',
    },
    '@andrey-aka-skif/app-errors': Object.fromEntries(
      Object.keys(ERROR_TYPE).map(key => [key, ERROR_TYPE_PAGE])
    ),
  },
}
