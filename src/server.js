import express from 'express';
import config from './config/config.js';
import logger from './middleware/logger.js';
import serviceRoutes from './routes/serviceRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
  res.send('Node.js Backend is running!');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
