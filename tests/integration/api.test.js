const request = require('supertest');
const app = require('../../src/app');

describe('Quiz API Integration Tests', () => {
  
  it('should complete full quiz workflow', async () => {
    const questionsResponse = await request(app).get('/api/quiz/questions');
    expect(questionsResponse.status).toBe(200);
    
    const questionId = questionsResponse.body[0].id;
    const submitResponse = await request(app)
      .post('/api/quiz/submit')
      .send({ questionId, answer: 0 });
    expect(submitResponse.status).toBe(200);
  });
});
