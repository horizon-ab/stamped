import { getDbConnection } from './db_util';

const initializeDatabase = async () => {
    const db = await getDbConnection();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS stamps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        challenge_id INTEGER NOT NULL,
        location_id INTEGER NOT NULL,
        point_of_interest_id INTEGER NOT NULL,
        stamp VARCHAR(255) NOT NULL,
        datetime DATETIME NOT NULL,
        photolink VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (challenge_id) REFERENCES challenges(id)
        FOREIGN KEY (location_id) REFERENCES locations(id),
        FOREIGN KEY (point_of_interest_id) REFERENCES point_of_interests(id)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poi_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        FOREIGN KEY (poi_id) REFERENCES point_of_interests(id)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS point_of_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        FOREIGN KEY (location_id) REFERENCES locations(id)
        );
    `);

    console.log('Database initialized.');
    await db.close();
};

initializeDatabase().catch((err) => console.error(err));