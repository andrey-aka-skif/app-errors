/**
 * Пригоден ли аргумент для разбора.
 * @description Отсеивает null, undefined и примитивы: обращение к их
 * свойствам либо выбрасывает TypeError, либо не имеет смысла.
 * @param {*} error - Значение, переданное в билдер
 * @returns {boolean} true, если значение можно разбирать
 */
export const isParsable = error => {
  return typeof error === 'object' && error !== null
}
