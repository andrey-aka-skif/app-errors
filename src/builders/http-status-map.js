import HttpError from '../errors/http-error.js'
import BadRequestError from '../errors/bad-request-error.js'
import UnauthorizedError from '../errors/unauthorized-error.js'
import ForbiddenError from '../errors/forbidden-error.js'
import NotFoundError from '../errors/not-found-error.js'
import ConflictError from '../errors/conflict-error.js'
import UnprocessableEntityError from '../errors/unprocessable-entity-error.js'
import TooManyRequestsError from '../errors/too-many-requests-error.js'
import InternalServerError from '../errors/internal-server-error.js'

/**
 * Статусы, для которых есть отдельный класс ошибки.
 * @description Map, а не объектный литерал: поиск по литералу достал бы
 * унаследованные свойства Object.prototype, и ответ со статусом "toString"
 * или "constructor" привёл бы к попытке создать экземпляр функции. Билдер
 * вызывается в catch-блоке и падать не должен.
 */
const STATUS_TO_ERROR = new Map([
  [400, BadRequestError],
  [401, UnauthorizedError],
  [403, ForbiddenError],
  [404, NotFoundError],
  [409, ConflictError],
  [422, UnprocessableEntityError],
  [429, TooManyRequestsError],
  [500, InternalServerError],
])

/**
 * Создаёт ошибку приложения по HTTP-статусу ответа.
 * @description Для статуса без отдельного класса возвращает обобщённый
 * HttpError, поэтому статус и тело ответа сохраняются при любом ответе
 * сервера — в том числе для 503 от прокси, самого ретраибельного случая
 * из всех.
 *
 * Ключ поиска приводится к числу: строковый статус "404" от экзотического
 * клиента всё равно найдёт NotFoundError, а нечисловой ключ даёт NaN,
 * которого в Map просто нет. В сам HttpError статус попадает как есть —
 * класс не выдумывает преобразований.
 *
 * @param {number} status - HTTP-статус ответа
 * @param {*} [details=null] - Детали, извлечённые из тела ответа
 * @param {*} [cause] - Исходная ошибка HTTP-библиотеки
 * @returns {HttpError} Экземпляр HttpError или одного из его наследников
 */
export const statusToError = (status, details = null, cause) => {
  const ErrorClass = STATUS_TO_ERROR.get(Number(status))

  return ErrorClass
    ? new ErrorClass(details, { cause })
    : new HttpError(status, details, { cause })
}
