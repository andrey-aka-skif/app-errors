/**
 * Причинные фразы HTTP-статусов.
 *
 * Таблица общая для всего семейства HttpError: сообщение по умолчанию
 * выводится из статуса, а не хранится литералом в каждом классе. Иначе
 * обобщённый HttpError, создаваемый для статусов без отдельного класса
 * (502, 503, 504 и прочие), остался бы без человекочитаемого сообщения —
 * а ровно ради него сообщения и переводились с машинных токенов.
 */
const HTTP_REASON_PHRASE = Object.freeze({
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  413: 'Content Too Large',
  415: 'Unsupported Media Type',
  // RFC 9110 называет 422 Unprocessable Content, но здесь нужна фраза,
  // совпадающая с именем класса UnprocessableEntityError и с токеном типа
  // UnprocessableEntity.
  422: 'Unprocessable Entity',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
})

const FALLBACK_PHRASE = 'HTTP Error'

/**
 * Причинная фраза для HTTP-статуса.
 * @description Поиск ведётся через Object.hasOwn: обычное обращение по ключу
 * достало бы унаследованные свойства Object.prototype, и статус вида
 * "toString" вернул бы функцию вместо строки. Билдер вызывается в catch
 * и падать не должен.
 * @param {number} status - HTTP-статус ответа
 * @returns {string} Фраза из таблицы, "HTTP <статус>" либо запасной вариант
 */
export const reasonPhrase = status => {
  if (Object.hasOwn(HTTP_REASON_PHRASE, status)) {
    return HTTP_REASON_PHRASE[status]
  }

  return Number.isInteger(status) ? `HTTP ${status}` : FALLBACK_PHRASE
}
