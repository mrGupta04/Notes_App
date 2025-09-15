const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true, // This creates an index automatically
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subscription_plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  }
}, {
  timestamps: true
});

// Remove this duplicate index definition:
// tenantSchema.index({ slug: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);