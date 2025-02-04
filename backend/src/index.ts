import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import projectRoutes from './presentationlayer/projectRoutes';
import commentRoutes from './presentationlayer/commentRoutes';
import bodyParser from 'body-parser';


dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Connect to MongoDB
connectDB().then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my Portfolio');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});