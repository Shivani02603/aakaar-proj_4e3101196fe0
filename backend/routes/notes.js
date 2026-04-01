const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Note = require('../models/note');
const authMiddleware = require('../middleware/auth');

// GET /notes - Retrieve all notes (protected)
router.get(
  '/',
  authMiddleware,
  async (req, res) => {
    try {
      const notes = await Note.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// POST /notes - Create a new note (protected)
router.post(
  '/',
  authMiddleware,
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title must not exceed 200 characters'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Content is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const note = await Note.create({ title, content, userId: req.user.id });
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// DELETE /notes/:id - Delete a note by ID (protected)
router.delete(
  '/:id',
  authMiddleware,
  [
    param('id')
      .isInt({ gt: 0 })
      .withMessage('Note ID must be a positive integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const noteId = parseInt(req.params.id, 10);
    try {
      const note = await Note.findByPk(noteId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      // TODO: Add authorization check to ensure user owns the note (bug: missing ownership verification)
      if (note.userId !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not own this note' });
      }
      await note.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = router;