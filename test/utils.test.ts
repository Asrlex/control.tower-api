import { FormattedResponseI } from 'src/api/entities/interfaces/api.entity';

export function isFormattedResponse(
  response: any,
): asserts response is FormattedResponseI {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Response is not an object');
  }

  if (typeof response.statusCode !== 'number') {
    throw new Error('Response does not have a valid statusCode');
  }

  if (!('data' in response)) {
    throw new Error('Response does not have data');
  }

  if ('pagination' in response) {
    if (
      typeof response.pagination !== 'object' ||
      response.pagination === null
    ) {
      throw new Error('Response pagination is not an object');
    }
    if (typeof response.pagination.total !== 'number') {
      throw new Error('Response pagination does not have a valid total');
    }
    if (typeof response.pagination.offset !== 'number') {
      throw new Error('Response pagination does not have a valid offset');
    }
    if (typeof response.pagination.limit !== 'number') {
      throw new Error('Response pagination does not have a valid limit');
    }
  }

  if ('searchCriteria' in response) {
    if (
      typeof response.searchCriteria !== 'object' ||
      response.searchCriteria === null
    ) {
      throw new Error('Response searchCriteria is not an object');
    }
    if (!('filters' in response.searchCriteria)) {
      throw new Error('Response searchCriteria does not have filters');
    }
    if (!('sort' in response.searchCriteria)) {
      throw new Error('Response searchCriteria does not have sort');
    }
    if (!('search' in response.searchCriteria)) {
      throw new Error('Response searchCriteria does not have search');
    }
  }
}
