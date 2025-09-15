const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // This creates an index automatically
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  }
}, {
  timestamps: true
});

// Remove these duplicate index definitions:
// userSchema.index({ email: 1 });
// userSchema.index({ tenant: 1 });

userSchema.virtual('password').set(function(password) {
  this.password_hash = bcrypt.hashSync(password, 10);
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password_hash);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password_hash;
  return user;
};

module.exports = mongoose.model('User', userSchema);