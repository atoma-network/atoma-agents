import request from 'supertest';
import { Application } from 'express';
import '../setup';

declare const testApp: Application;

describe('Health Check Endpoints', () => {
  it('GET /health should return 200 OK', async () => {
    const response = await request(testApp)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('msg', 'ok');
  });

  it('GET / should return API info', async () => {
    const response = await request(testApp).get('/').expect('Content-Type', /json/).expect(200);

    expect(response.body).toHaveProperty('message', 'Atoma Agents API');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
});
