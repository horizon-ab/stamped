import express, { Request, Response, Router } from 'express';
import { getPointOfInterestByUserStamps, getPointOfInterests } from '../../queries/point_of_interest';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const pois = await getPointOfInterests();
    res.json(pois);
});

router.get('/getByUser/:name', async (req: Request, res: Response) => {
    const { name } = req.params;  
    
    try {
        const location = await getPointOfInterestByUserStamps(name);

        if (location.length === 0) {
            res.status(404).json({ error: 'No points of interest found for this user' });
        } else {
            res.status(200).json(location);
        }
    } catch (error) {
        console.error('Error fetching points of interest by user:', error);
        res.status(500).json({ error: error});
    }
});

export default router;