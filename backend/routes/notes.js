const express = require('express');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all notes for current tenant
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching notes for tenant:', req.user.tenant_id);

    const notes = await Note.find({ tenant: req.user.tenant_id })
      .populate('user', 'email')
      .sort({ updatedAt: -1 });

    console.log('Found notes:', notes.length);

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific note
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      tenant: req.user.tenant_id
    }).populate('user', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create note
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Check subscription limits - only for free plan
    const tenant = await Tenant.findById(req.user.tenant_id);
    if (tenant.subscription_plan === 'free') {
      const noteCount = await Note.countDocuments({ tenant: req.user.tenant_id });
      if (noteCount >= 3) {
        return res.status(403).json({
          error: 'Note limit reached. Upgrade to Pro for unlimited notes.'
        });
      }
    }

    // Create the note
    const note = await Note.create({
      title,
      content: content || '',
      user: req.user.id,
      tenant: req.user.tenant_id
    });

    await note.populate('user', 'email');

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update note
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, tenant: req.user.tenant_id },
      { title, content: content || '', updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('user', 'email');

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete note
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      tenant: req.user.tenant_id
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;