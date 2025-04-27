import { getDbConnection } from './db_util';

const initializeDatabase = async () => {
    const db = await getDbConnection();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            bio TEXT,
            joined TEXT,
            avatar TEXT
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS stamps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name VARCHAR(255) NOT NULL,
        challenge_name VARCHAR(255) NOT NULL,
        location_name VARCHAR(255) NOT NULL,
        point_of_interest_name VARCHAR(255) NOT NULL,
        stamp VARCHAR(255) NOT NULL,
        datetime DATETIME NOT NULL,
        photolink VARCHAR(255) NOT NULL,
        FOREIGN KEY (user_name) REFERENCES users(name),
        FOREIGN KEY (challenge_name) REFERENCES challenges(name),
        FOREIGN KEY (location_name) REFERENCES locations(name),
        FOREIGN KEY (point_of_interest_name) REFERENCES point_of_interests(name)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS challenges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        poi_name VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        FOREIGN KEY (poi_name) REFERENCES point_of_interests(name)
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS point_of_interests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_name VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        FOREIGN KEY (location_name) REFERENCES locations(name)
        );
    `);

    console.log('Database initialized.');
    await db.close();
};

initializeDatabase().catch((err) => console.error(err));