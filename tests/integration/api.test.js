const request = require('supertest');
const app = require('../../src/app');

describe('Quiz API Integration Tests', () => {
  
  it('should complete full quiz workflow', async () => {
    // Step 1: Get all questions
    const questionsResponse = await request(app).get('/api/quiz/questions');
    expect(questionsResponse.status).toBe(200);
    expect(questionsResponse.body.length).toBeGreaterThan(0);

    // Step 2: Get a specific question
    const questionId = questionsResponse.body[0].id;
    const questionResponse = await request(app).get(`/api/quiz/questions/${questionId}`);
    expect(questionResponse.status).toBe(200);

    // Step 3: Submit an answer
    const submitResponse = await request(app)
      .post('/api/quiz/submit')
      .send({ questionId, answer: 0 });
    expect(submitResponse.status).toBe(200);

    // Step 4: Submit all answers
    const answers = questionsResponse.body.map((q, index) => ({
      questionId: q.id,
      answer: 0
    }));

    const finalResponse = await request(app)
      .post('/api/quiz/submit-all')
      .send({ answers });
    
    expect(finalResponse.status).toBe(200);
    expect(finalResponse.body).toHaveProperty('score');
    expect(finalResponse.body).toHaveProperty('percentage');
  });

  it('should handle API in correct order', async () => {
    // Health check
    const health = await request(app).get('/api/quiz/health');
    expect(health.status).toBe(200);

    // Get questions
    const questions = await request(app).get('/api/quiz/questions');
    expect(questions.status).toBe(200);

    // Submit answer
    const submit = await request(app)
      .post('/api/quiz/submit')
      .send({ questionId: 1, answer: 0 });
    expect(submit.status).toBe(200);
  });

  it('should handle errors gracefully', async () => {
    // Invalid question ID
    const response1 = await request(app).get('/api/quiz/questions/abc');
    expect(response1.status).toBe(404);

    // Invalid submit data
    const response2 = await request(app)
      .post('/api/quiz/submit')
      .send({ invalid: 'data' });
    expect(response2.status).toBe(400);

    // Invalid submit-all data
    const response3 = await request(app)
      .post('/api/quiz/submit-all')
      .send({ answers: 'not-an-array' });
    expect(response3.status).toBe(400);
  });
});