import { formatTemplateString } from '@/common/utils/string-formatter';

function buildUpdateQuery(
  baseQuery: string,
  originalItem: any,
  dto: any,
  pairs: { [key: string]: { dbName: string; itemName: string } }[],
  idMapping: { dbName: string; itemName: string },
): string {
  let updateFields = '';
  pairs.forEach((pair) => {
    const key = Object.keys(pair)[0];
    const { dbName, itemName } = pair[key];
    if (dto[key] !== null && dto[key] !== undefined) {
      const originalValue = getNestedProperty(originalItem, itemName);
      if (originalValue !== dto[key]) {
        updateFields += `${dbName} = '${dto[key]}', `;
      }
    }
  });
  if (updateFields.length === 0) {
    return null;
  }
  return formatTemplateString(baseQuery, {
    id: originalItem[idMapping.itemName],
    UpdateFields: updateFields,
  });
}

export function getNestedProperty(obj: any, path: string): any {
  return path
    .split('.')
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
}

export default buildUpdateQuery;
