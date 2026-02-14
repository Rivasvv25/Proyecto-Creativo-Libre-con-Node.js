const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../data/pomodoro.db');
const db = new Database(dbPath, { verbose: console.log });

function migrate() {
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);
  console.log('Database migrated successfully.');
}

if (require.main === module) {
  if (process.argv[2] === '--migrate') {
    migrate();
  }
}

module.exports = db;
