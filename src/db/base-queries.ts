export const baseQueries = {
  FindAll: `
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
  Find: `
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
  FindById: `
    select
      @SelectFields
    from @SelectTables
    WHERE @SelectId = @id
  `,
  Create: `
    INSERT INTO @InsertTable (@InsertFields)
    VALUES (@InsertValues)
    @InsertOutput
  `,
  Update: `
    UPDATE @UpdateTable
    SET @UpdateFields
    WHERE @UpdateId = '@id'
  `,
  Delete: `
    UPDATE @DeleteTable
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE @DeleteId = '@id'
  `,
  HardDelete: `
    DELETE FROM @DeleteTable
    WHERE id = '@id'
  `,
  SpecificHardDelete: `
    DELETE FROM @DeleteTable
    WHERE @DeleteFields
  `,
  CreateLog: `
    INSERT INTO logs (table_name, changed_by, change_description)
    VALUES (@InsertValues)
  `,
};
