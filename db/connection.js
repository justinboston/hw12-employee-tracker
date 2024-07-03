const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password', 
  database: 'employees',
  port: 5432
});

module.exports = pool;
