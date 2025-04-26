import { getDbConnection } from '../db/db_util';


export async function getLocations() {
    const db = await getDbConnection();

    const locations = await db.all('SELECT * FROM locations');
    await db.close();
    return locations;
}

export async function createLocation(name: string, description: string, latitude: number, longitude: number) {
    const db = await getDbConnection();

    const location = await db.run('INSERT INTO locations (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', name, description, latitude, longitude);
    await db.close();
    return location;
}