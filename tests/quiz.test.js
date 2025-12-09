const request = require('supertest');
const app = require('../src/app');

describe('Quiz API Routes', () => {
  describe('GET /api/quiz/questions', () => {
    test('should return all questions without answers', async () => {
      const response = await request(app).get('/api/quiz/questions');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Verify questions don't have correctAnswer field
      response.body.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(question).not.toHaveProperty('correctAnswer');
      });
    });

    test('should return questions with correct structure', async () => {
      const response = await request(app).get('/api/quiz/questions');
      
      if (response.body.length > 0) {
        const question = response.body[0];
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options.length).toBeGreaterThan(0);
      }
    });
  });

  describe('GET /api/quiz/questions/:id', () => {
    test('should return a specific question', async () => {
      const response = await request(app).get('/api/quiz/questions/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('options');
      expect(response.body).not.toHaveProperty('correctAnswer');
    });

    test('should return 404 for non-existent question', async () => {
      const response = await request(app).get('/api/quiz/questions/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Question not found');
    });
  });

  describe('POST /api/quiz/submit', () => {
    test('should accept correct answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1, answer: 0 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('questionId', 1);
      expect(response.body).toHaveProperty('isCorrect');
      expect(response.body).toHaveProperty('correctAnswer');
    });

    test('should reject incorrect answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1, answer: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.isCorrect).toBe(false);
    });

    test('should return 400 for missing questionId', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ answer: 0 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 for invalid questionId', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 999, answer: 0 });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/quiz/submit-all', () => {
    test('should calculate score correctly', async () => {
      const answers = [
        { questionId: 1, answer: 0 },
        { questionId: 2, answer: 1 },
        { questionId: 3, answer: 0 }
      ];
      
      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({ answers });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('percentage');
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    test('should return 400 for missing answers array', async () => {
      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid answers format', async () => {
      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({ answers: 'not an array' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/quiz/health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/api/quiz/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});

