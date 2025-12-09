const express = require('express');
const router = express.Router();
const questions = require('../data/questions.json');

// Get all questions (without correct answers)
router.get('/questions', (req, res) => {
  const questionsWithoutAnswers = questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options
  }));
  res.json(questionsWithoutAnswers);
});

// Get a specific question
router.get('/questions/:id', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  const questionWithoutAnswer = {
    id: question.id,
    question: question.question,
    options: question.options
  };
  res.json(questionWithoutAnswer);
});

// Submit answer and get result
router.post('/submit', (req, res) => {
  const { questionId, answer } = req.body;
  
  if (!questionId || answer === undefined) {
    return res.status(400).json({ error: 'questionId and answer are required' });
  }

  const question = questions.find(q => q.id === parseInt(questionId));
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const isCorrect = question.correctAnswer === parseInt(answer);
  res.json({
    questionId: question.id,
    isCorrect,
    correctAnswer: question.correctAnswer
  });
});

// Submit all answers and get score
router.post('/submit-all', (req, res) => {
  const { answers } = req.body; // answers: [{ questionId: 1, answer: 0 }, ...]
  
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'answers array is required' });
  }

  let score = 0;
  const results = answers.map(userAnswer => {
    const question = questions.find(q => q.id === parseInt(userAnswer.questionId));
    if (!question) {
      return { questionId: userAnswer.questionId, error: 'Question not found' };
    }
    const isCorrect = question.correctAnswer === parseInt(userAnswer.answer);
    if (isCorrect) score++;
    
    return {
      questionId: question.id,
      isCorrect,
      correctAnswer: question.correctAnswer,
      userAnswer: userAnswer.answer
    };
  });

  res.json({
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    results
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;