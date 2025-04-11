import { EscapingException } from 'src/common/exceptions/escaping.exception';
import {
  SearchCriteriaI,
  FormattedResponseI,
  SortI,
  FilterI,
} from '../../api/entities/interfaces/api.entity';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  ErrorCodes,
  SuccessCodes,
} from '../../api/entities/enums/response-codes.enum';

/**
 * Formatear la respuesta de la API
 * @param data - respuesta del servicio
 * @param total - total de elementos
 * @param offset - desplazamiento
 * @param limit - límite de elementos
 * @returns objeto con la respuesta formateada
 */
export const formatResponse = (
  data: any,
  options?: {
    total?: number;
    page?: number;
    limit?: number;
    id?: string | number;
    searchCriteria?: SearchCriteriaI;
    error?: any;
    statusCode?: number;
    batch?: string;
    article?: string;
  },
): FormattedResponseI => {
  const isDev = process.env.NODE_ENV === 'development';

  if (options?.error) {
    const errorResponse = {
      statusCode: options.error.statusCode || ErrorCodes.InternalServerError,
      data: {
        name: options.error.name,
        message: options.error.message,
        validationErrors: '',
        trace: isDev ? options.error.stack : undefined,
      },
    };

    switch (options.error.name) {
      case 'UnauthorizedException':
        errorResponse.statusCode = ErrorCodes.Unauthorized;
        errorResponse.data.trace = null;
        break;
      case 'NotFoundException':
        errorResponse.statusCode = ErrorCodes.NotFound;
        errorResponse.data.trace = null;
        break;
      case 'BadRequestException':
        errorResponse.statusCode = ErrorCodes.BadRequest;
        errorResponse.data.validationErrors = isDev
          ? options.error.response.errors
          : undefined;
        break;
      case 'ForbiddenException':
        errorResponse.statusCode = ErrorCodes.Forbidden;
        break;
      case 'DatabaseQueryException':
        errorResponse.statusCode = ErrorCodes.InternalServerError;
        errorResponse.data.trace = isDev ? options.error.toObject() : undefined;
        break;
      default:
        errorResponse.statusCode = ErrorCodes.InternalServerError;
        break;
    }

    return errorResponse;
  }

  const pagination =
    options?.total || options?.page || options?.limit
      ? {
          total: options.total,
          offset: options?.page
            ? parseInt(options.page.toString(), 10) *
              parseInt(options.limit.toString(), 10)
            : undefined,
          limit: options?.limit
            ? parseInt(options.limit.toString(), 10)
            : undefined,
        }
      : undefined;

  return {
    statusCode: options?.statusCode || SuccessCodes.Ok,
    data,
    pagination,
    id: options?.id,
    searchCriteria: options?.searchCriteria,
    batch: options?.batch,
    article: options?.article,
  };
};

/**
 * Validación de un objeto DTO
 */
export const dtoValidator = () => {
  return new ValidationPipe({
    transform: true,
    exceptionFactory: (errors: ValidationError[]) => {
      const detailedErrors = errors.map((error) => {
        return {
          property: error.property,
          constraints: error.constraints,
          children: error.children,
        };
      });
      return new BadRequestException({
        message: 'Validation failed',
        errors: detailedErrors,
      });
    },
  });
};

/**
 * Metodo para transformar los filtros en una consulta SQL
 * Inicialmente se escapan todos los valores de los filtros para evitar inyección SQL
 * @param filters - filtros - se admiten operadores IN, BETWEEN y LIKE, además de los operadores de comparación
 * @param search - búsqueda - se busca en varios campos
 * @param order - orden - se ordena por varios campos, si no se especifica se ordena por fecha de recepción
 * @returns string - consulta SQL
 */
export const filterstoSQL = (
  searchCriteria: SearchCriteriaI,
): { filters: string; sort: SortI } => {
  let { filters, search, sort } = searchCriteria;
  try {
    const escapeSql = (value: string) => value.replace(/'/g, "''");
    if (filters) {
      filters = filters.map((filter: FilterI) => ({
        ...filter,
        value: escapeSql(filter.value),
      }));
    }
    if (search) {
      search = escapeSql(search);
    }
    if (sort) {
      sort = sort.map((sort: SortI) => ({
        ...sort,
        field: escapeSql(sort.field),
      }));
    }
  } catch (error) {
    throw new EscapingException('Error escaping filter values');
  }

  let sqlFilters = `1=1`;
  if (filters) {
    filters.forEach((filter: FilterI) => {
      const f = filter.operator.toLowerCase();
      if (f === 'in') {
        sqlFilters += ` AND ${filter.field} ${filter.operator} (${filter.value})`;
      } else if (f === 'between') {
        const [start, end] = filter.value.split(',');
        sqlFilters += ` AND ${filter.field} ${filter.operator} '${start}' AND '${end}'`;
      } else if (f === 'like') {
        sqlFilters += ` AND ${filter.field} ${filter.operator} '%${filter.value}%'`;
      } else {
        sqlFilters += ` AND ${filter.field} ${filter.operator} '${filter.value}'`;
      }
    });
  }
  return { filters: sqlFilters, sort: sort[0] };
};

/**
 * Método para eliminar nulls de un objeto DTO
 * @param dto - objeto DTO
 * @returns string - objeto DTO sin nulls
 */
export const denullifyDto = (dto: any): any => {
  Object.keys(dto).forEach((key) => {
    if (dto[key] === null) {
      dto[key] = '';
    }
  });
  return dto;
};

/**
 * Método para comparar dos strings que pueden ser enteros
 * @param a - primer string
 * @param b - segundo string
 * @returns boolean - resultado de la comparación
 */
export const compareIntegerStrings = (a: string, b: string): boolean => {
  const aInt = parseInt(a, 10);
  const bInt = parseInt(b, 10);

  return aInt === bInt;
};

/**
 * Método para formatear una fecha
 * @param date - fecha a formatear
 * @returns fecha formateada
 */
export const formatDate = (date: string): string => {
  const year = date.substring(0, 4);
  const month = date.substring(4, 6);
  const day = date.substring(6, 8);
  const newDate = new Date(`${year}-${month}-${day}`);
  return newDate ? newDate.toISOString() : '';
};

/**
 * Método para convertir una fecha juliana a fecha
 * @param jdn - fecha juliana
 * @returns fecha
 */
export const julianToISODateString = (jdn: string): string => {
  const jdnNumber = parseInt(jdn, 10);
  const a = jdnNumber + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 2;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return new Date(year, month - 1, day).toISOString();
};

/**
 * Método para eliminar los valores nulos de un array
 * @param row - array con valores
 * @returns array sin valores nulos
 */
export const denullify = (row: any[]): any => {
  return row.map((value) => (value === null ? '' : value));
};
