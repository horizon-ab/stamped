import { getDbConnection } from '../db/db_util';


export async function getPointOfInterests() {
    const db = await getDbConnection();

    const pointOfInterests = await db.all('SELECT * FROM point_of_interest');
    await db.close();
    return pointOfInterests;
}

export async function getPointOfInterestByName(name: string) {
    const db = await getDbConnection();

    const pointOfInterest = await db.get('SELECT * FROM point_of_interest WHERE name = ?', name);
    await db.close();
    return pointOfInterest;
}

export async function getPointOfInterestByUserStamps(userName: string) {
    const db = await getDbConnection();
    const pointOfInterests = await db.all(
        `SELECT point_of_interest.* 
         FROM point_of_interest 
         JOIN stamps ON point_of_interest.id = stamps.point_of_interest_id 
         JOIN users ON stamps.user_id = users.id 
         WHERE users.name = ?`,
        userName
    );
    await db.close();
    return pointOfInterests;
}

export async function createPointOfInterest(name: string, description: string, latitude: number, longitude: number) {
    const db = await getDbConnection();

    const pointOfInterest = await db.run('INSERT INTO point_of_interest (name, description, latitude, longitude) VALUES (?, ?, ?, ?)', name, description, latitude, longitude);
    await db.close();
    return pointOfInterest;
}