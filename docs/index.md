---
layout: home

hero:
  name: app-errors
  text: Типизированные ошибки приложения
  tagline: Ошибка HTTP-клиента приводится к классу пакета, дальше ветвление строится по instanceof и по типу ошибки
  actions:
    - theme: brand
      text: Обзор
      link: /guide/
    - theme: alt
      text: Справочник API
      link: /api/
    - theme: alt
      text: Репозиторий
      link: https://github.com/andrey-aka-skif/app-errors

features:
  - title: Иерархия вместо кодов
    details: Пятнадцать классов ошибок с общим предком. Ответы сервера собраны под HttpError, обрыв связи, таймаут и отмена запроса выделены отдельно.
    link: /api/
    linkText: Классы ошибок
  - title: Билдеры для HTTP-клиентов
    details: fromAxios и fromSuperagent разбирают ошибку клиента и сохраняют статус, тело ответа и исходную ошибку в cause.
    link: /api/functions/fromAxios
    linkText: Билдеры
  - title: Переживает сериализацию
    details: Тип, сообщение и детали остаются на месте после спреда и JSON.stringify — дискриминатором служит поле type, а не текст сообщения.
    link: /guide/
    linkText: Как это устроено
---
