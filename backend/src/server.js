import express from 'express';
import cors from 'cors';
import applicationsRouter from './routes/applicationsRouter.js';

export const startServer = () => {
  const app = express();
  const PORT = Number(process.env.PORT) || 4000;

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/applications', applicationsRouter);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ message: 'Invalid JSON' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid id' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  app.listen(PORT, (error) => {
    if (error) {
      console.error('Server failed to start:', error.message);
      process.exit(1);
    }
    console.log(`Server is running on port ${PORT}`);
  });
};