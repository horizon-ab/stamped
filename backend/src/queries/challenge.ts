import { getDbConnection } from '../db/db_util';


export async function getChallenges() {
    const db = await getDbConnection();

    const challenges = await db.all('SELECT * FROM challenges');
    await db.close();
    return challenges;
}

export async function getChallengeByPoiName(poi_name: string) {
    const db = await getDbConnection();

    const challenge = await db.get('SELECT * FROM challenges WHERE poi_name = ?', poi_name);
    await db.close();
    return challenge;
}

export async function createChallenge(poi_name: string, name: string, description: string) {
    const db = await getDbConnection();

    const challenge = await db.run('INSERT INTO challenges (poi_name, name, description) VALUES (?, ?, ?)', poi_name, name, description);
    await db.close();
    return challenge;
}