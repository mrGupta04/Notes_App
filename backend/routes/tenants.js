const express = require('express');
const Tenant = require('../models/Tenant');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Upgrade tenant subscription
router.post('/:slug/upgrade', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;

    // Verify admin belongs to this tenant
    if (req.user.tenant_slug !== slug) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { subscription_plan: 'pro' },
      { new: true }
    );

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({ 
      message: 'Subscription upgraded to Pro',
      tenant: {
        id: tenant._id,
        slug: tenant.slug,
        name: tenant.name,
        subscription_plan: tenant.subscription_plan
      }
    });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tenant info
router.get('/:slug', authenticateToken, async (req, res) => {
  try {
    const { slug } = req.params;

    // Verify user belongs to this tenant
    if (req.user.tenant_slug !== slug) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tenant = await Tenant.findOne({ slug });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({
      id: tenant._id,
      slug: tenant.slug,
      name: tenant.name,
      subscription_plan: tenant.subscription_plan
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;