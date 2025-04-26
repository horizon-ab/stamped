import express, { Request, Response } from 'express';
import googleDriveRouter from './routes/external/google_drive_router'; // Import the router

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to Stamped Backend! We\'re mega cooked chat.');
});

// Use the Google Drive router
app.use('/api/google-drive', googleDriveRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});