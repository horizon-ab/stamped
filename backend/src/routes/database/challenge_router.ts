import express, { Request, Response, Router } from 'express';
import { getChallengeByPoiName, getChallenges } from '../../queries/challenge';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const challenges = await getChallenges();
    res.json(challenges);
});

router.get('/getByPOI/:poi' , async (req: Request, res: Response) => {
    const { poi } = req.params;
    const challenge = await getChallengeByPoiName(poi);

    if (challenge) {
        res.status(200).json(challenge);
    } else {
        res.status(404).json({ error: 'Challenge not found' });
    }
});

export default router;