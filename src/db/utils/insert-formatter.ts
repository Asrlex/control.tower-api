import { formatTemplateString } from '@/common/utils/string-formatter';

/**
 * Método para montar dinámicamente un insert de registro
 * @param baseQuery - query base de SQL
 * @param dto - DTO
 * @param createdBy - usuario que crea el registro
 * @param pairs - array de parejas key-value
 * @returns string
 */
function buildInsertQuery(
  baseQuery: string,
  dto: any,
  pairs: { [key: string]: { dbName: string; itemName: string } }[],
): string {
  let insertFields = '';
  let insertValues = '';
  pairs.forEach((pair) => {
    const key = Object.keys(pair)[0];
    const { dbName } = pair[key];
    if (dto[key] !== null && dto[key] !== undefined) {
      insertFields += `${dbName}, `;
      insertValues += `'${dto[key]}', `;
    }
  });
  return formatTemplateString(baseQuery, {
    InsertFields: insertFields,
    InsertValues: insertValues,
  });
}

export default buildInsertQuery;
