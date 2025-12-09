const request = require('supertest');
const app = require('../../src/app');

describe('Quiz API Unit Tests', () => {
  
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/quiz/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/quiz/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('GET /api/quiz/questions', () => {
    it('should return all questions', async () => {
      const response = await request(app).get('/api/quiz/questions');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/quiz/submit', () => {
    it('should validate answer', async () => {
      const response = await request(app)
        .post('/api/quiz/submit')
        .send({ questionId: 1, answer: 0 });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isCorrect');
    });
  });
});
