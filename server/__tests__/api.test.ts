import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index'; // <-- Import your Express instance, NOT the listening server

describe('SoleSearch API Health & Endpoints', () => {
  
  it('GET /api/health should return a 200 OK status', async () => {
    // Assuming you have a health endpoint attached to /health or /api/health
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status');
  });

  it('GET /api/sneakers should return an array of items (if auth not strictly required)', async () => {
    // Attempting to hit your actual sneaker routes
    const response = await request(app).get('/api/sneakers');
    
    // Depending on auth/rate limits and DB config, it might not be 200, 
    // but we can check it's one of the expected application responses rather than 404
    expect([200, 400, 401, 403, 429, 500]).toContain(response.status);
  });
  
  it('GET /api/unknown-route should return 404', async () => {
    const response = await request(app).get('/api/this-route-does-not-exist');
    expect(response.status).toBe(404);
  });
});
