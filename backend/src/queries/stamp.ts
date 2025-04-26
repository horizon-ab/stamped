import { getDbConnection } from '../db/db_util';


export async function getStamps() {
    const db = await getDbConnection();

    const stamps = await db.all('SELECT * FROM stamps');
    await db.close();
    return stamps;
}

export async function getStampsByUserName(userName: string) {
    const db = await getDbConnection();

    const stamps = await db.all(
        `SELECT stamps.* 
         FROM stamps 
         JOIN users ON stamps.user_id = users.id 
         WHERE users.name = ?`,
        userName
    );
    await db.close();
    return stamps;
}

export async function getStampsByLocationName(locationName: string) {
    const db = await getDbConnection();

    const stamps = await db.all(
        `SELECT stamps.* 
         FROM stamps 
         JOIN locations ON stamps.location_id = locations.id 
         WHERE locations.name = ?`,
        locationName
    );
    await db.close();
    return stamps;
}

export async function getStampsByPoiName(poiName: string) {
    const db = await getDbConnection();

    const stamps = await db.all(
        `SELECT stamps.* 
         FROM stamps 
         JOIN points_of_interest ON stamps.poi_id = points_of_interest.id 
         WHERE points_of_interest.name = ?`,
        poiName
    );
    await db.close();
    return stamps;
}