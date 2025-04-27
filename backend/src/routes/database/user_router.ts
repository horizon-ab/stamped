import express, { Request, Response } from 'express';
import { createUser, getUserByName, getUsers } from '../../queries/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const users = await getUsers();
    res.json(users);
});

router.get('/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    try {
        const user = await getUserByName(name);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

router.post('/sign-in', async (req: Request, res: Response) => {
    const name = req.body.name;
    const user = await getUserByName(name);
    
    if (user) {
        res.status(200).json(user);
    } else {
        // create a new user
        const newUser = await createUser(name);
        if (newUser) {
            res.status(201).json(newUser);
        } else {
            res.status(500).json({ message: 'Failed to create user' });
        }
    }
});

export default router;