export const baseQueries = {
  getAll: `
    WITH UniqueValues AS (
      SELECT DISTINCT @KeyParam
      FROM @SelectTables
    )
    SELECT
      ai.*,
      (SELECT COUNT(*) FROM UniqueValues) AS total
    FROM (
      select
        @SelectFields
      from @SelectTables
    ) ai
  `,
  search: `
    WITH AliasItems AS (
      SELECT 
        @SelectFields
      FROM @IncludedItemsTable
    ),
    FilteredItems AS (
      SELECT 
        *
      FROM AliasItems
      WHERE @DynamicWhereClause
    ),
    IncludedItems AS (
      SELECT 
        @KeyParam,
        ROW_NUMBER() OVER (ORDER BY @DynamicOrderByField @DynamicOrderByDirection) as rn
      FROM (SELECT DISTINCT @KeyParam, @DynamicOrderByField FROM FilteredItems) as UniqueItems
    ),
    FilteredRows AS (
      SELECT @KeyParam
      FROM IncludedItems
      WHERE rn BETWEEN @start AND @end
    ),
    TotalItems AS (
      SELECT COUNT(DISTINCT @KeyParam) as total FROM FilteredItems
    )
    select
      ai.*,
      (SELECT total FROM TotalItems) as total
    FROM AliasItems ai
    INNER JOIN FilteredRows fr on @FilterJoins
    ORDER BY ai.@DynamicOrderByField @DynamicOrderByDirection
  `,
  getById: `
    select
      @SelectFields
    from @SelectTables
    WHERE @SelectId = @id
  `,
  insertmssql: `
    INSERT INTO @InsertTable (@InsertFields)
    @InsertOutput
    VALUES (@InsertValues)
  `,
  insertsqlite: `
    INSERT INTO @InsertTable (@InsertFields)
    VALUES (@InsertValues)
    @InsertOutput
  `,
  update: `
    UPDATE @UpdateTable
    SET @UpdateFields
    WHERE @UpdateId = '@id'
  `,
  delete: `
    UPDATE @DeleteTable
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE @DeleteId = '@id'
  `,
  hardDelete: `
    DELETE FROM @DeleteTable
    WHERE id = '@id'
  `,
  specificHardDelete: `
    DELETE FROM @DeleteTable
    WHERE @DeleteFields
  `,
  createLog: `
    INSERT INTO logs (table_name, changed_by, change_description)
    VALUES (@InsertValues)
  `,
};

/**
 * Función para generar una consulta a partir de una consulta base y un array de sustituciones
 * @param baseQuery - consulta base
 * @param substitutions - array de sustituciones
 * @returns string - consulta generada
 */
export const generateQuery = (
  baseQuery: string,
  substitutions: { key: string; value: string }[],
) => {
  let query = baseQuery;
  substitutions.forEach((substitution) => {
    query = query.replaceAll(substitution.key, substitution.value);
  });
  return query;
};
