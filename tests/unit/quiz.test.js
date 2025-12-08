const request = require('supertest');
const app = require('../../src/app');

describe('Quiz API Unit Tests', () => {
  
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/quiz/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/quiz/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/quiz/questions', () => {
    it('should return all questions without answers', async () => {
      const response = await request(app).get('/api/quiz/questions');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      
      // Check that answers are not included
      response.body.forEach(question => {
        expect(question).toHaveProperty('id');
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(question).not.toHaveProperty('correctAnswer');
      });
    });
  });

  describe('GET /api/quiz/questions/:id', () => {
    it('should return a specific question', async () => {
      const response = await request(app).get('/api/quiz/questions/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('question');
      expect(response.body).toHaveProperty('options');
      expect(response.body).not.toHaveProperty('correctAnswer');
    });

    it('should return 404 for non-existent question', async () => {
      const response = await request(app).get('/api/quiz/questions/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should validate correct answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1, answer: 0 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('questionId', 1);
      expect(response.body).toHaveProperty('isCorrect');
      expect(response.body).toHaveProperty('correctAnswer');
    });

    it('should validate incorrect answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1, answer: 2 });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isCorrect', false);
    });

    it('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent question', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 999, answer: 0 });
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/quiz/submit-all', () => {
    it('should calculate correct score', async () => {
      const answers = [
        { questionId: 1, answer: 0 },  // Correct
        { questionId: 2, answer: 1 },  // Correct
        { questionId: 3, answer: 0 },  // Correct
        { questionId: 4, answer: 1 },  // Correct
        { questionId: 5, answer: 0 }   // Correct
      ];

      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({ answers });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score', 5);
      expect(response.body).toHaveProperty('total', 5);
      expect(response.body).toHaveProperty('percentage', 100);
      expect(response.body).toHaveProperty('results');
      expect(Array.isArray(response.body.results)).toBe(true);
    });

    it('should calculate partial score', async () => {
      const answers = [
        { questionId: 1, answer: 0 },  // Correct
        { questionId: 2, answer: 0 },  // Wrong
        { questionId: 3, answer: 0 }   // Correct
      ];

      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({ answers });
      
      expect(response.status).toBe(200);
      expect(response.body.score).toBeLessThan(response.body.total);
      expect(response.body).toHaveProperty('percentage');
    });

    it('should return 400 for missing answers array', async () => {
      const response = await request(app)
        .post('/api/quiz/submit-all')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});