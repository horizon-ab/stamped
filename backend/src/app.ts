import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Welcome to Stamped Backend! We\'re mega cooked chat.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});