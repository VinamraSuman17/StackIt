const express = require('express');
const { body, validationResult } = require('express-validator');
const Answer = require('../models/Answer');
const Question = require('../models/Question');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/question/:questionId', async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'name username')
      .sort({ votes: -1, createdAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, [
  body('content').trim().isLength({ min: 20 }).withMessage('Answer must be at least 20 characters'),
  body('questionId').isMongoId().withMessage('Valid question ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, questionId } = req.body;

    const question = await Question.findById(questionId).populate('author', 'name username');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = new Answer({
      content,
      question: questionId,
      author: req.user._id
    });

    await answer.save();
    await User.findByIdAndUpdate(req.user._id, { $inc: { answersGiven: 1 } });
    await Question.findByIdAndUpdate(questionId, { $push: { answers: answer._id } });

    if (question.author._id.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        recipient: question.author._id,
        sender: req.user._id,
        type: 'answer',
        message: `${req.user.name} answered your question: ${question.title}`,
        questionId: questionId,
        answerId: answer._id
      });
      await notification.save();
    }

    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'name username');

    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body;
    const answerId = req.params.id;
    const userId = req.user._id;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const existingVote = answer.voters.find(v => v.user.toString() === userId.toString());

    if (existingVote) {
      if (existingVote.vote === voteType) {
        answer.voters = answer.voters.filter(v => v.user.toString() !== userId.toString());
        answer.votes += voteType === 'up' ? -1 : 1;
      } else {
        existingVote.vote = voteType;
        answer.votes += voteType === 'up' ? 2 : -2;
      }
    } else {
      answer.voters.push({ user: userId, vote: voteType });
      answer.votes += voteType === 'up' ? 1 : -1;
    }

    await answer.save();
    res.json({ votes: answer.votes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/accept', auth, async (req, res) => {
  try {
    const answerId = req.params.id;
    const answer = await Answer.findById(answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    if (question.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only question author can accept answers' });
    }

    await Answer.updateMany({ question: answer.question }, { isAccepted: false });
    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answerId;
    await question.save();

    res.json({ message: 'Answer accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;