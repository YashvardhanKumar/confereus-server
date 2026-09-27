import request from 'supertest';
import { app } from '../app';

describe('App & HTTP Endpoints', () => {
  it('GET /health returns 200 and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET / returns 200 with hello', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello');
  });

  it('handles CORS options requests properly', async () => {
    const res = await request(app)
      .options('/health')
      .set('Origin', 'https://confereus.codeflip.co.in');
    expect(res.headers['access-control-allow-origin']).toBe('https://confereus.codeflip.co.in');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });
});
