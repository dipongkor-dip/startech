import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'chat-service',
    timestamp: new Date().toISOString(),
  });
});

router.get('/chat', (req, res) => {
  res.json({ message: 'Chat service is running' });
});

export default router;
