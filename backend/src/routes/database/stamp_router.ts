import express, { Request, Response, Router } from 'express';
import { getStamps, getStampsByUserName } from '../../queries/stamp';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const stamps = await getStamps();
    res.json(stamps);
});

// this endpoint prob most important, returns all stamps for a user which in itself has image links
router.get('/getByUser', async (req: Request, res: Response) => {
    const { userName } = req.body; 

    try {
        const stamps = await getStampsByUserName(userName);
        res.status(200).json(stamps);
    } catch (error) {
        console.error('Error fetching stamps by user:', error);
        res.status(500).json({ error: error });
    }
});

router.get('/getByLocation', async (req: Request, res: Response) => {
    const { locationName } = req.body; 
    
    try {
        const stamps = await getStampsByUserName(locationName);
        res.status(200).json(stamps);
    } catch (error) {
        console.error('Error fetching stamps by location:', error);
        res.status(500).json({ error: error });
    }
});

router.get('/getByPOI', async (req: Request, res: Response) => {
    const { poiName } = req.body; 
    
    try {
        const stamps = await getStampsByUserName(poiName);
        res.status(200).json(stamps);
    } catch (error) {
        console.error('Error fetching stamps by POI:', error);
        res.status(500).json({ error: error });
    }
});

export default router;
