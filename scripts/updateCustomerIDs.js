const sql = require('mssql');

async function updateCustomerIds(config, startingId = 20001) {
  try {
    // Connect to database
    const pool = await sql.connect(config);

    // Start transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // 1. Get current max ID to calculate new identity seed
      const result = await transaction
        .request()
        .query('SELECT COUNT(*) as count FROM Customers');
      const totalCustomers = result.recordset[0].count;
      const newMaxId = startingId + totalCustomers - 1;

      // 2. Disable identity constraints
      await transaction.request().query('SET IDENTITY_INSERT Customers ON');

      // 3. Create temporary table with new IDs
      await transaction.request().query(`
                    SELECT 
                        ROW_NUMBER() OVER (ORDER BY ID) + ${startingId - 1} as NewId,
                        ID as OldId 
                    INTO #TempIds 
                    FROM Customers
                `);

      // 4. Update all records with new IDs
      // Using batches to avoid transaction log overflow
      const batchSize = 1000;
      await transaction.request().query(`
                    DECLARE @BatchStart int = 1
                    WHILE EXISTS (SELECT 1 FROM #TempIds WHERE NewId >= @BatchStart)
                    BEGIN
                        UPDATE c
                        SET c.ID = t.NewId
                        FROM Customers c
                        JOIN #TempIds t ON c.ID = t.OldId
                        WHERE t.NewId >= @BatchStart AND t.NewId < @BatchStart + ${batchSize}
                        
                        SET @BatchStart = @BatchStart + ${batchSize}
                    END
                `);

      // 5. Reset identity seed to continue from new max ID
      await transaction.request().query('SET IDENTITY_INSERT Customers OFF');

      await transaction.request().query(`
                    DBCC CHECKIDENT ('Customers', RESEED, ${newMaxId})
                `);

      // 6. Clean up
      await transaction.request().query('DROP TABLE #TempIds');

      // Commit transaction
      await transaction.commit();

      return {
        success: true,
        message: `Successfully updated ${totalCustomers} customer IDs. Next ID will be ${newMaxId + 1}`,
        totalUpdated: totalCustomers,
        nextId: newMaxId + 1,
      };
    } catch (err) {
      // Rollback transaction on error
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
      details: err,
    };
  } finally {
    sql.close();
  }
}

// Example usage:
const config = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
  options: {
    trustServerCertificate: true,
    enableArithAbort: true,
    ssl: { rejectUnauthorized: false },
  },
  pool: { max: 10, min: 0, idleTimeoutMillis: 10000 },
};

// Execute the update
updateCustomerIds(config, 20001)
  .then((result) => console.log(result))
  .catch((err) => console.error('Error:', err));
