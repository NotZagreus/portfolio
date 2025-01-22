import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my Portfolio');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
