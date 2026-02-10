/**
 * ===========================================
 * Payment Routes
 * ===========================================
 * 
 * Handles subscription management, Stripe checkout, and webhooks.
 * 
 * Routes:
 * GET /api/payments/plans - Get available plans
 * POST /api/payments/create-checkout - Create checkout session
 * POST /api/payments/create-portal - Create customer portal session
 * GET /api/payments/subscription - Get current subscription
 * POST /api/payments/cancel - Cancel subscription
 * POST /api/payments/reactivate - Reactivate subscription
 * POST /api/payments/webhook - Stripe webhook handler
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler');
const User = require('../models/User.model');
const {
  PLANS,
  createCheckoutSession,
  createCustomerPortalSession,
  getSubscription,
  cancelSubscription,
  reactivateSubscription,
  constructWebhookEvent,
} = require('../services/payment.service');

/**
 * @route   GET /api/payments/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', asyncHandler(async (req, res) => {
  const plans = Object.entries(PLANS).map(([id, plan]) => ({
    id,
    name: plan.name,
    features: plan.features,
    limits: plan.limits,
    hasPricing: id !== 'free',
  }));

  res.status(200).json({
    success: true,
    data: { plans }
  });
}));

/**
 * @route   POST /api/payments/create-checkout
 * @desc    Create Stripe checkout session
 * @access  Private
 */
router.post('/create-checkout', protect, asyncHandler(async (req, res) => {
  const { planId, interval = 'monthly' } = req.body;

  if (!planId) {
    return res.status(400).json({
      success: false,
      message: 'Plan ID is required'
    });
  }

  if (!['monthly', 'yearly'].includes(interval)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid billing interval'
    });
  }

  try {
    const user = await User.findById(req.user._id);
    const { sessionId, url, customerId } = await createCheckoutSession(user, planId, interval);

    // Save Stripe customer ID if new
    if (!user.stripeCustomerId && customerId) {
      user.stripeCustomerId = customerId;
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: { sessionId, url }
    });
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
}));

/**
 * @route   POST /api/payments/create-portal
 * @desc    Create Stripe customer portal session
 * @access  Private
 */
router.post('/create-portal', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.stripeCustomerId) {
    return res.status(400).json({
      success: false,
      message: 'No subscription found'
    });
  }

  try {
    const { url } = await createCustomerPortalSession(user.stripeCustomerId);

    res.status(200).json({
      success: true,
      data: { url }
    });
  } catch (error) {
    console.error('Portal error:', error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to create portal session'
    });
  }
}));

/**
 * @route   GET /api/payments/subscription
 * @desc    Get current subscription status
 * @access  Private
 */
router.get('/subscription', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.stripeSubscriptionId) {
    return res.status(200).json({
      success: true,
      data: {
        plan: 'free',
        subscription: null,
        limits: PLANS.free.limits,
        features: PLANS.free.features,
      }
    });
  }

  const subscription = await getSubscription(user.stripeSubscriptionId);
  const currentPlan = PLANS[user.plan] || PLANS.free;

  res.status(200).json({
    success: true,
    data: {
      plan: user.plan,
      subscription,
      limits: currentPlan.limits,
      features: currentPlan.features,
      planExpiresAt: user.planExpiresAt,
    }
  });
}));

/**
 * @route   POST /api/payments/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', protect, asyncHandler(async (req, res) => {
  const { immediately = false } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.stripeSubscriptionId) {
    return res.status(400).json({
      success: false,
      message: 'No active subscription found'
    });
  }

  try {
    await cancelSubscription(user.stripeSubscriptionId, immediately);

    res.status(200).json({
      success: true,
      message: immediately 
        ? 'Subscription cancelled immediately' 
        : 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    console.error('Cancel error:', error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
}));

/**
 * @route   POST /api/payments/reactivate
 * @desc    Reactivate cancelled subscription
 * @access  Private
 */
router.post('/reactivate', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user.stripeSubscriptionId) {
    return res.status(400).json({
      success: false,
      message: 'No subscription found'
    });
  }

  try {
    await reactivateSubscription(user.stripeSubscriptionId);

    res.status(200).json({
      success: true,
      message: 'Subscription reactivated successfully'
    });
  } catch (error) {
    console.error('Reactivate error:', error.message);
    res.status(400).json({
      success: false,
      message: 'Failed to reactivate subscription'
    });
  }
}));

/**
 * @route   POST /api/payments/webhook
 * @desc    Stripe webhook handler
 * @access  Public (verified by Stripe signature)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const planId = session.metadata.planId;

      if (userId && planId) {
        await User.findByIdAndUpdate(userId, {
          plan: planId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        });
        console.log(`✅ User ${userId} upgraded to ${planId} plan`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          planExpiresAt: new Date(subscription.current_period_end * 1000),
        });
        console.log(`✅ Subscription updated for user ${userId}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      if (userId) {
        await User.findByIdAndUpdate(userId, {
          plan: 'free',
          stripeSubscriptionId: null,
          planExpiresAt: null,
        });
        console.log(`✅ Subscription cancelled for user ${userId}`);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      console.log(`✅ Payment succeeded for invoice ${invoice.id}`);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      console.log(`❌ Payment failed for invoice ${invoice.id}`);
      // TODO: Send email notification to user
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}));

/**
 * @route   POST /api/payments/activate-premium
 * @desc    Activate a premium plan (demo / in-app activation when Stripe is not configured)
 * @access  Private
 */
router.post('/activate-premium', protect, asyncHandler(async (req, res) => {
  const { planId, paymentMethod = 'card', interval = 'monthly' } = req.body;

  if (!planId || !['basic', 'premium', 'enterprise'].includes(planId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid plan selected'
    });
  }

  const user = await User.findById(req.user._id);

  // If Stripe is configured, redirect to Stripe checkout
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    try {
      const { sessionId, url, customerId } = await createCheckoutSession(user, planId, interval);
      if (!user.stripeCustomerId && customerId) {
        user.stripeCustomerId = customerId;
        await user.save();
      }
      return res.status(200).json({
        success: true,
        data: { sessionId, url, method: 'stripe' }
      });
    } catch (err) {
      // Fall through to demo mode if Stripe fails
      console.warn('Stripe checkout failed, using demo activation:', err.message);
    }
  }

  // Demo / Development mode — activate plan directly
  const durationMonths = interval === 'yearly' ? 12 : 1;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + durationMonths);

  user.plan = planId;
  user.planExpiresAt = expiresAt;
  await user.save();

  // Add notification
  user.notifications.push({
    type: 'system',
    title: '🎉 Premium Activated!',
    message: `Your ${PLANS[planId].name} plan is now active until ${expiresAt.toLocaleDateString()}.`,
  });
  await user.save();

  res.status(200).json({
    success: true,
    message: `${PLANS[planId].name} plan activated successfully!`,
    data: {
      method: 'direct',
      plan: planId,
      planName: PLANS[planId].name,
      features: PLANS[planId].features,
      limits: PLANS[planId].limits,
      expiresAt,
    }
  });
}));

/**
 * @route   GET /api/payments/status
 * @desc    Get current premium status with full plan details
 * @access  Private
 */
router.get('/status', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const userPlan = user.plan || 'free';
  const planDetails = PLANS[userPlan] || PLANS.free;
  const isPremium = ['basic', 'premium', 'enterprise'].includes(userPlan);
  const isExpired = user.planExpiresAt && new Date(user.planExpiresAt) < new Date();

  res.status(200).json({
    success: true,
    data: {
      plan: userPlan,
      planName: planDetails.name,
      isPremium: isPremium && !isExpired,
      isExpired,
      features: planDetails.features,
      limits: planDetails.limits,
      expiresAt: user.planExpiresAt || null,
      stripeConnected: !!user.stripeSubscriptionId,
    }
  });
}));

module.exports = router;
