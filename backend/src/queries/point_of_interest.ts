import { getDbConnection } from '../db/db_util';


export async function getPointOfInterests() {
    const db = await getDbConnection();

    const pointOfInterests = await db.all('SELECT * FROM point_of_interest');
    await db.close();
    return pointOfInterests;
}

export async function createPointOfInterest(name: string, description: string, latitude: number, longitude: number) {
    const db = await getDbConnection();

    const pointOfInterest = await db.run('INSERT INTO point_of_interest (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', name, description, latitude, longitude);
    await db.close();
    return pointOfInterest;
}