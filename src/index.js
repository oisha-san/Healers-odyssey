import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('db.json');
const db = new Low(adapter);

async function initializeDB() {
  await db.read();
  db.data ||= { users: [], tasks: [], achievements: [] }; // Add default data structure
  await db.write();
}

initializeDB().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

export default db;