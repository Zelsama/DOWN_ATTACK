// database/connection.js
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'bdo-optimizer-db-items.mysql.database.azure.com',
    user: 'ZelsOptimizer',
    password: 'Maconhacomsal_',
    database: 'bdooptimizer',
    ssl: { rejectUnauthorized: true}
  },
  pool: { min: 2, max: 10 }
});

// Exporte a instância DIRETAMENTE
export default db;