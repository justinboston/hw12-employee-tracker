const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password', 
  database: 'employeetracker_db',
  port: 5432
}

console.log('You are now connected to database "employeetracker_db" as user "postgres"')

);

module.exports = pool;
