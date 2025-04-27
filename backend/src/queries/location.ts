import { getDbConnection } from '../db/db_util';


export async function getLocations() {
    const db = await getDbConnection();

    const locations = await db.all('SELECT * FROM locations');
    await db.close();
    return locations;
}

export async function getLocationByName(name: string) {
    const db = await getDbConnection();
    const location = await db.get('SELECT * FROM locations WHERE name = ?', name);
    await db.close();
    return location;
}

export async function getLocationByUserStamps(userName: string) {
    const db = await getDbConnection();

    const location = await db.all(
        `SELECT locations.* 
         FROM locations 
         JOIN stamps ON locations.name = stamps.location_name
         JOIN users ON stamps.user_name = users.name 
         WHERE users.name = ?`,
        userName
    );
    await db.close();
    return location;
}

export async function getLocationByPoiName(poiName: string) {
    const db = await getDbConnection();
    const location = await db.all(
        `SELECT locations.* 
         FROM locations 
         JOIN point_of_interests ON locations.id = point_of_interests.location_id 
         WHERE point_of_interests.name = ?`,
        poiName
    );
    await db.close();
    return location;
}

export async function createLocation(name: string, description: string, latitude: number, longitude: number) {
    const db = await getDbConnection();

    const location = await db.run('INSERT INTO locations (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', name, description, latitude, longitude);
    await db.close();
    return location;
}