import { defineConfig } from 'vitepress'

// Сайдбар раздела API генерируется TypeDoc перед запуском VitePress
// (скрипты docs:dev и docs:build вызывают docs:api первым шагом).
import typedocSidebar from '../api/typedoc-sidebar.json'

const REPO_URL = 'https://github.com/andrey-aka-skif/app-errors'

export default defineConfig({
  lang: 'ru-RU',
  title: 'app-errors',
  description:
    'Классы ошибок приложения, связанные с обращением к внешнему API и внутренней логикой',

  // Сайт публикуется по адресу https://andrey-aka-skif.github.io/app-errors/.
  // Без base ассеты запрашиваются от корня домена и не находятся.
  base: '/app-errors/',

  themeConfig: {
    nav: [
      { text: 'Руководство', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'История версий', link: `${REPO_URL}/blob/master/CHANGELOG.md` },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Руководство',
          items: [
            { text: 'Обзор', link: '/guide/' },
            { text: 'Разработка', link: '/guide/development' },
            { text: 'Линии выпуска', link: '/guide/release-lines' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Справочник API',
          items: typedocSidebar,
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: REPO_URL }],

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Поиск',
            buttonAriaLabel: 'Поиск',
          },
          modal: {
            displayDetails: 'Показать подробности',
            resetButtonTitle: 'Сбросить поиск',
            backButtonTitle: 'Закрыть поиск',
            noResultsText: 'Ничего не найдено',
            footer: {
              selectText: 'выбрать',
              navigateText: 'переход',
              closeText: 'закрыть',
            },
          },
        },
      },
    },

    outline: { label: 'Содержание страницы' },
    docFooter: { prev: 'Предыдущая', next: 'Следующая' },
    returnToTopLabel: 'Наверх',
    sidebarMenuLabel: 'Разделы',
    darkModeSwitchLabel: 'Оформление',
    lightModeSwitchTitle: 'Переключить на светлую тему',
    darkModeSwitchTitle: 'Переключить на тёмную тему',

    footer: {
      message: 'Опубликовано под лицензией MIT',
      copyright: '© 2025-2026 andrey-aka-skif',
    },
  },
})
