import { Router, IRouter } from 'express';
import { prisma } from '../config/database';

const router: IRouter = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'payment-service',
    timestamp: new Date().toISOString()
  });
});

// Get all payments
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payment by ID
router.get('/payments/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id }
    });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Create new payment
router.post('/payments', async (req, res) => {
  try {
    const { orderId, userId, amount, currency, paymentMethod, provider } = req.body;
    
    const payment = await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency: currency || 'USD',
        paymentMethod,
        provider
      }
    });
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment status
router.patch('/payments/:id/status', async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(transactionId && { transactionId })
      }
    });
    
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get payment methods for a user
router.get('/payment-methods/:userId', async (req, res) => {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { 
        userId: req.params.userId,
        isActive: true 
      },
      orderBy: { isDefault: 'desc' }
    });
    
    res.json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Add payment method
router.post('/payment-methods', async (req, res) => {
  try {
    const { userId, type, provider, providerPaymentMethodId, isDefault } = req.body;
    
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId,
        type,
        provider,
        providerPaymentMethodId,
        isDefault: isDefault || false
      }
    });
    
    res.status(201).json(paymentMethod);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add payment method' });
  }
});

export default router;
