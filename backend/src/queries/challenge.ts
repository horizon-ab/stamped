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