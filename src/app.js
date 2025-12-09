const express = require('express');
const cors = require('cors');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quiz', quizRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Quiz API is running!',
    instructions: {
      start: 'npm run dev',
      browser: 'Open http://localhost:3000 to see this message',
      questions: 'Open http://localhost:3000/api/quiz/questions to view all questions'
    },
    version: '1.0.0',
    endpoints: {
      'GET /api/quiz/questions': 'Get all questions',
      'GET /api/quiz/questions/:id': 'Get specific question',
      'POST /api/quiz/submit': 'Submit single answer',
      'POST /api/quiz/submit-all': 'Submit all answers',
      'GET /api/quiz/health': 'Health check'
    }
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Quiz API running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} for the welcome message`);
    console.log(`Questions endpoint: http://localhost:${PORT}/api/quiz/questions`);
  });
}
module.exports = app;