import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Health Check', () => {
  test('GET /api/health should return 200 and health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
  });
});