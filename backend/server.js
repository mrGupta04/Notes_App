require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const tenantRoutes = require('./routes/tenants');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB = process.env.MONGODB;

// Validate MongoDB URI
if (!MONGODB) {
  console.error('MONGODB is not defined in environment variables');
  process.exit(1);
}

if (!MONGODB.startsWith('mongodb://') && !MONGODB.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB URI. Must start with mongodb:// or mongodb+srv://');
  process.exit(1);
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// trust proxy if running behind one (Heroku, Vercel, nginx, etc.)
app.set("trust proxy", 1);

// Rate limiting (increase max requests here)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // ⬅️ increase this number (default was 100)
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// apply the limiter globally
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/tenants', tenantRoutes);
app.use('/notes', noteRoutes);

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB and start server
mongoose.connect(MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('Connected to MongoDB');

    // Initialize test data
    await require('./config/initDatabase')();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log('\nTest accounts:');
      console.log('- admin@acme.test (password: password)');
      console.log('- user@acme.test (password: password)');
      console.log('- admin@globex.test (password: password)');
      console.log('- user@globex.test (password: password)');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    console.log('Please check your MONGODB in the .env file');
    process.exit(1);
  });
