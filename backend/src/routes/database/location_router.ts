import express, { Request, Response, Router } from 'express';
import { getLocationByUserStamps, getLocations } from '../../queries/location';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const locations = await getLocations();
    console.log('Locations:', locations);
    res.json(locations);
});

router.get('/getByUser/:user', async (req: Request, res: Response) => {
    const { name } = req.params; 
    
    try {
        const location = await getLocationByUserStamps(name);
        if (location.length === 0) {
            res.status(404).json({ error: 'No locations found for this user' });
            return;
        } else {
            res.status(200).json(location);
        }
    } catch (error) {
        console.error('Error fetching location by user:', error);
        res.status(500).json({ error: error });
    }
});

export default router;