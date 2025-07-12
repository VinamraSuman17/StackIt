const express = require('express');
const { body, validationResult } = require('express-validator');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag, sort = 'newest' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }

    let sortQuery = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { createdAt: 1 };
        break;
      case 'votes':
        sortQuery = { votes: -1 };
        break;
      case 'views':
        sortQuery = { views: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate('author', 'name username')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    res.json({
      questions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name username');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10-200 characters'),
  body('content').trim().isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('tags').isArray({ min: 1, max: 5 }).withMessage('Must have 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    const question = new Question({
      title,
      content,
      tags,
      author: req.user._id
    });

    await question.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { questionsAsked: 1 } });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'name username');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const questionId = req.params.id;
    const userId = req.user._id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const existingVote = question.voters.find(v => v.user.toString() === userId.toString());

    if (existingVote) {
      if (existingVote.vote === voteType) {
        question.voters = question.voters.filter(v => v.user.toString() !== userId.toString());
        question.votes += voteType === 'up' ? -1 : 1;
      } else {
        existingVote.vote = voteType;
        question.votes += voteType === 'up' ? 2 : -2;
      }
    } else {
      question.voters.push({ user: userId, vote: voteType });
      question.votes += voteType === 'up' ? 1 : -1;
    }

    await question.save();
    res.json({ votes: question.votes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;