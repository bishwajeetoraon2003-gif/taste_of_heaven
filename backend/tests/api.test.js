const request = require('supertest');
const app = require('../src/app');

describe('Taste of Heaven Backend Integration Tests', () => {
  it('GET /health - Should return 200 OK and healthy status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  it('GET /api/v1/menu - Should return all menu items', async () => {
    const res = await request(app).get('/api/v1/menu');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(Array.isArray(res.body.data.menuItems)).toBe(true);
  });

  it('POST /api/v1/reservations - Should create a reservation request', async () => {
    const res = await request(app)
      .post('/api/v1/reservations')
      .send({
        guestName: 'Lord Sterling',
        guestEmail: 'sterling@luxury.com',
        guestPhone: '+1 555 999 8888',
        guestsCount: 2,
        reservationDate: '2026-08-15',
        reservationTime: '19:00',
        tableAtmosphere: 'Metropolis Skyline View'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('POST /api/v1/orders - Should place an online order', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({
        customerName: 'Lady Victoria',
        customerEmail: 'victoria@luxury.com',
        customerPhone: '+1 555 111 2222',
        orderType: 'delivery',
        items: [
          { title: 'A5 Miyazaki Wagyu Tenderloin', price: 185.00, qty: 1 }
        ]
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('POST /api/v1/contact - Should submit a contact inquiry', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'VIP Guest',
        email: 'vip@luxury.com',
        phone: '+1 555 333 4444',
        message: 'Requesting private salon pricing'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('POST /api/v1/auth/login - Admin Login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@tasteofheaven.com',
        password: 'admin123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.data.user.role).toEqual('admin');
  });
});
