import fs from 'fs';
import path from 'path';
import { connectMongo, disconnectMongo } from '../modelsMongo/mongo.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationsDir = path.join(__dirname, '../insertsMongo');

const runMigrations = async () => {
  await connectMongo();

  const files = fs.readdirSync(migrationsDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      try {
        const migrationPath = path.join(migrationsDir, file);
        const { default: migration } = await import(migrationPath);
        if (typeof migration === 'function') {
          await migration();
          console.log(`Migration ${file} executed successfully.`);
        } else {
          console.error(`Migration ${file} does not export a function.`);
        }
      } catch (error) {
        console.error(`Error executing migration ${file}:`, error);
        process.exit(1);
      }
    }
  }

  await disconnectMongo();
  process.exit(0);
};

runMigrations();
