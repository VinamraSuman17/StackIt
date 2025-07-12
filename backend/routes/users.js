const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const questions = await Question.find({ author: req.params.id })
      .populate('author', 'name username')
      .sort({ createdAt: -1 })
      .limit(10);

    const answers = await Answer.find({ author: req.params.id })
      .populate('question', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      questions,
      answers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, username } = req.body;
    
    const existingUser = await User.findOne({
      username,
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, username },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('name username reputation questionsAsked answersGiven')
      .sort({ reputation: -1 })
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;