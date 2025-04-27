import { getDbConnection } from '../db/db_util';


export async function getUsers() {
    const db = await getDbConnection();

    const users = await db.all('SELECT * FROM users');
    await db.close();
    return users;
}

export async function getUserByName(name: string) {
    const db = await getDbConnection();

    const user = await db.get('SELECT * FROM users WHERE name = ?', name);
    await db.close();
    return user;
}

export async function createUser(name: string) {
    const db = await getDbConnection();

    try {
        await db.run('INSERT INTO users (name) VALUES (?)', name);
        const newUser = await db.get('SELECT * FROM users WHERE name = ?', name);
        await db.close();

        return newUser;
    } catch (error: any) {
        await db.close();
        if (error.code === 'SQLITE_CONSTRAINT') {
            throw new Error(`User with name "${name}" already exists.`);
        }
        throw error; // Re-throw other unexpected errors
    }
}