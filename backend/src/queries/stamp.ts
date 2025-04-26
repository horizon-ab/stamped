import { getDbConnection } from '../db/db_util';


export async function getStamps() {
    const db = await getDbConnection();

    const stamps = await db.all('SELECT * FROM stamps');
    await db.close();
    return stamps;
}

export async function getStampByUserId(userId: string) {
    const db = await getDbConnection();

    const stamp = await db.get('SELECT * FROM stamps WHERE user_id = ?', userId);
    await db.close();
    return stamp;
}

export async function getStampByLocationId(locationId: string) {
    const db = await getDbConnection();

    const stamp = await db.get('SELECT * FROM stamps WHERE location_id = ?', locationId);
    await db.close();
    return stamp;
}

export async function getStampByChallengeId(challengeId: string) {
    const db = await getDbConnection();

    const stamp = await db.get('SELECT * FROM stamps WHERE challenge_id = ?', challengeId);
    await db.close();
    return stamp;
}

export async function getStampByPointOfInterestId(pointOfInterestId: string) {
    const db = await getDbConnection();

    const stamp = await db.get('SELECT * FROM stamps WHERE point_of_interest_id = ?', pointOfInterestId);
    await db.close();
    return stamp;
}
