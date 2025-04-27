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
         JOIN users ON stamps.user_name = users.name
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
         JOIN locations ON stamps.location_name = locations.name 
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
         JOIN point_of_interests ON stamps.point_of_interest_name = point_of_interests.name
         WHERE point_of_interests.name = ?`,
        poiName
    );
    await db.close();
    return stamps;
}

export async function getStampsByUserAndLocation(userName: string, locationName: string) {
    const db = await getDbConnection();
    const stamps = await db.all(
        `SELECT stamps.* 
         FROM stamps 
         JOIN users ON stamps.user_name = users.name
         JOIN locations ON stamps.location_name = locations.name
         WHERE users.name = ? AND locations.name = ?`,
        userName,
        locationName
    );
    await db.close();
    return stamps;
}

export async function createStamp(
    userName: string,
    challengeName: string,
    locationName: string,
    poiName: string,
    stampName: string,
    imageUrl: string
) {

    const date = new Date();

    const db = await getDbConnection();

    const result = await db.run(
        `INSERT INTO stamps (user_name, challenge_name, location_name, point_of_interest_name, stamp, datetime, photolink) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        userName,
        challengeName,
        locationName,
        poiName,
        stampName,
        date.toISOString(),
        imageUrl
    );
    await db.close();
    return result;
}