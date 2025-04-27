import express, { Request, Response } from 'express';
import googleDriveRouter from './routes/external/google_drive_router';
import userRouter from './routes/database/user_router';
import stampRouter from './routes/database/stamp_router';
import locationRouter from './routes/database/location_router';
import poiRouter from './routes/database/point_of_interest_router';
import challengeRouter from './routes/database/challenge_router';
import cors from 'cors';

const app = express();
const port = 80;
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to Stamped Backend! We\'re mega cooked chat.');
});

app.use('/api/google-drive', googleDriveRouter);
app.use('/api/user', userRouter)
app.use('/api/stamp', stampRouter)
app.use('/api/location', locationRouter)
app.use('/api/poi', poiRouter)
app.use('/api/challenge', challengeRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});