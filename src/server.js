import express from 'express';
import config from './config/config.js';
import logger from './middleware/logger.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Node.js Backend is running!');
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
