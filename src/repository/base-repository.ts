import { generateQuery, baseQueries } from '@/db/database.utils';
import {
  SearchCriteriaI,
  SortI,
  FilterI,
} from 'src/api/entities/interfaces/api.entity';
import { EscapingException } from 'src/common/exceptions/escaping.exception';
import { DatabaseConnection } from 'src/db/database.connection';
import { KafkaService } from 'src/kafka/kafka.service';

export class BaseRepository {
  protected connection: DatabaseConnection;
  protected kafkaService: KafkaService;

  constructor(connection: DatabaseConnection, kafkaService: KafkaService) {
    this.connection = connection;
    this.kafkaService = kafkaService;
  }

  /**
   * Método para guardar log de acciones sensibles
   * @param description - acción
   * @param entity - entidad
   */
  async saveLog(
    action: string,
    table: string,
    description: string,
  ): Promise<void> {
    const sql = generateQuery(baseQueries.createLog, [
      {
        key: '@InsertValues',
        value: `'${table}', 'system', '${description}'`,
      },
    ]);
    await this.connection.execute(sql);

    setTimeout(async () => {
      await this.kafkaService.sendMessage(
        `control-tower-${action}`,
        JSON.stringify({ table, description }),
      );
    }, 0);
  }

  /**
   * Método para eliminar nulls de un objeto DTO
   * @param dto - objeto DTO
   * @returns string - objeto DTO sin nulls
   */
  denullifyDto(dto: any): any {
    Object.keys(dto).forEach((key) => {
      if (dto[key] === null) {
        dto[key] = '';
      }
    });
    return dto;
  }

  /**
   * Metodo para transformar los filtros en una consulta SQL
   * Inicialmente se escapan todos los valores de los filtros para evitar inyección SQL
   * @param filters - filtros - se admiten operadores IN, BETWEEN y LIKE, además de los operadores de comparación
   * @param search - búsqueda - se busca en varios campos
   * @param order - orden - se ordena por varios campos, si no se especifica se ordena por fecha de recepción
   * @returns string - consulta SQL
   */
  filterstoSQL(searchCriteria: SearchCriteriaI): {
    filters: string;
    sort: SortI;
  } {
    let { filters, search, sort } = searchCriteria;
    try {
      const escapeSql = (value: string, operator: string) => {
        if (operator.toLowerCase() === 'in') {
          return value.replace(/'/g, "''").replace(/''/g, "'");
        }
        return value.replace(/'/g, "''");
      };
      if (filters) {
        filters = filters.map((filter: FilterI) => ({
          ...filter,
          value: escapeSql(filter.value, filter.operator),
        }));
      }
      if (search) {
        search = escapeSql(search, 'like');
      }
      if (sort) {
        sort = sort.map((sort: SortI) => ({
          ...sort,
          field: escapeSql(sort.field, 'like'),
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
          sqlFilters += ` AND ${filter.field} ${filter.operator} ${filter.value}`;
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
  }
}
