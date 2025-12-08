const express = require('express');
const cors = require('cors');
const path = require('path');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/quiz', quizRoutes);

// Root endpoint serves the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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