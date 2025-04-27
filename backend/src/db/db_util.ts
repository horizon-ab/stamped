import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// Open a database connection
export const getDbConnection = async () => {
  return open({
    filename: path.join(__dirname, 'stamped.db'), // Path to your database file
    driver: sqlite3.Database,
  });
};