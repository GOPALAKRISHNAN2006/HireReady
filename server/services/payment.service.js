/**
 * ===========================================
 * Payment Service - Stripe Integration
 * ===========================================
 * 
 * Handles subscription management, checkout sessions, and webhooks.
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ===========================================
// Plan Configuration
// ===========================================
const PLANS = {
  free: {
    name: 'Free',
    features: [
      '5 Mock Interviews/month',
      'Basic Analytics',
      'Community Access',
      'Daily Challenges',
    ],
    limits: {
      interviews: 5,
      aptitudeTests: 10,
      resumeUploads: 1,
    }
  },
  basic: {
    name: 'Basic',
    priceMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    priceYearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
    features: [
      '25 Mock Interviews/month',
      'Advanced Analytics',
      'AI Feedback',
      'Resume Builder',
      'Priority Support',
    ],
    limits: {
      interviews: 25,
      aptitudeTests: 50,
      resumeUploads: 5,
    }
  },
  premium: {
    name: 'Premium',
    priceMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    priceYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    features: [
      'Unlimited Mock Interviews',
      'All Basic Features',
      'Company-Specific Prep',
      'Career Roadmap',
      '1-on-1 Mentorship',
      'Certificate of Completion',
    ],
    limits: {
      interviews: -1, // unlimited
      aptitudeTests: -1,
      resumeUploads: 20,
    }
  },
  enterprise: {
    name: 'Enterprise',
    priceMonthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY,
    priceYearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY,
    features: [
      'Everything in Premium',
      'Custom Branding',
      'Team Management',
      'API Access',
      'Dedicated Support',
      'Custom Integrations',
    ],
    limits: {
      interviews: -1,
      aptitudeTests: -1,
      resumeUploads: -1,
    }
  }
};

/**
 * Create a Stripe checkout session for subscription
 * @param {Object} user - User object
 * @param {string} planId - Plan identifier (basic, premium, enterprise)
 * @param {string} interval - billing interval (monthly, yearly)
 * @returns {Object} - Stripe checkout session
 */
const createCheckoutSession = async (user, planId, interval = 'monthly') => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }

  const plan = PLANS[planId];
  if (!plan || planId === 'free') {
    throw new Error('Invalid plan selected');
  }

  const priceId = interval === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  if (!priceId) {
    throw new Error('Price not configured for this plan');
  }

  // Create or retrieve Stripe customer
  let customerId = user.stripeCustomerId;
  
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user._id.toString()
      }
    });
    customerId = customer.id;
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/settings/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/settings/subscription?canceled=true`,
    metadata: {
      userId: user._id.toString(),
      planId: planId,
    },
    subscription_data: {
      metadata: {
        userId: user._id.toString(),
        planId: planId,
      }
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return {
    sessionId: session.id,
    url: session.url,
    customerId
  };
};

/**
 * Create customer portal session for managing subscription
 * @param {string} customerId - Stripe customer ID
 * @returns {Object} - Customer portal session
 */
const createCustomerPortalSession = async (customerId) => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/settings/subscription`,
  });

  return { url: session.url };
};

/**
 * Get subscription details
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} - Subscription details
 */
const getSubscription = async (subscriptionId) => {
  if (!subscriptionId) return null;
  
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: subscription.items.data[0]?.price?.nickname || 'Unknown',
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error.message);
    return null;
  }
};

/**
 * Cancel subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {boolean} immediately - Whether to cancel immediately or at period end
 * @returns {Object} - Updated subscription
 */
const cancelSubscription = async (subscriptionId, immediately = false) => {
  if (immediately) {
    return await stripe.subscriptions.cancel(subscriptionId);
  } else {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
  }
};

/**
 * Reactivate subscription that was set to cancel
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Object} - Updated subscription
 */
const reactivateSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  });
};

/**
 * Construct webhook event from payload
 * @param {Buffer} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Object} - Stripe event
 */
const constructWebhookEvent = (payload, signature) => {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
};

module.exports = {
  PLANS,
  createCheckoutSession,
  createCustomerPortalSession,
  getSubscription,
  cancelSubscription,
  reactivateSubscription,
  constructWebhookEvent,
};
