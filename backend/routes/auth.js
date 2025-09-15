const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email }).populate('tenant');
    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role,
      tenant_id: user.tenant._id,
      tenant_slug: user.tenant.slug
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenant._id,
          slug: user.tenant.slug,
          name: user.tenant.name,
          subscription_plan: user.tenant.subscription_plan
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('tenant');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      tenant: {
        id: user.tenant._id,
        slug: user.tenant.slug,
        name: user.tenant.name,
        subscription_plan: user.tenant.subscription_plan
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;