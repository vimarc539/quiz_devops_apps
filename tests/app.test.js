const request = require('supertest');
const app = require('../src/app');

describe('App Root Endpoint', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Quiz API is running!');
    expect(response.body).toHaveProperty('endpoints');
  });

  test('GET / should return correct API structure', async () => {
    const response = await request(app).get('/');
    
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('instructions');
    expect(response.body.endpoints).toBeDefined();
  });
});

