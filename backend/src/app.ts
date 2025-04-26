import express, { Request, Response } from 'express';
import googleDriveRouter from './routes/external/google_drive_router';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to Stamped Backend! We\'re mega cooked chat.');
});

app.use('/api/google-drive', googleDriveRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});