const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('Auth Routes', () => {

    // Before each test in this file, create a single user to test against.
    beforeEach(async () => {
        // We use the User model directly here because we need to control the exact state
        // of the database before testing the registration and login controllers.
        await User.create({ 
            name: 'Test User', 
            email: 'test@example.com', 
            password: 'password123', 
            role: 'tenant' 
        });
    });

    // --- Tests for Authentication Middleware ---
    describe('Auth Middleware', () => {
        it('should return 401 Unauthorized if no token is provided', async () => {
            const res = await request(app).get('/api/landlord/properties');
            expect(res.statusCode).toBe(401);
        });

        it('should return 401 Unauthorized for a malformed token', async () => {
            const res = await request(app).get('/api/landlord/properties').set('Authorization', 'Bearer badtoken');
            expect(res.statusCode).toBe(401);
        });
    });

    // --- Tests for Registration Endpoint ---
    describe('POST /api/auth/register', () => {
        it('should return 409 Conflict if trying to register with an existing email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Another User',
                    email: 'test@example.com', // This email already exists from the beforeEach block
                    password: 'password123',
                    role: 'tenant'
                });

            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe('User with this email already exists');
        });
    });

    // --- Tests for Login Endpoint ---
    describe('POST /api/auth/login', () => {
        it('should return 401 Unauthorized for login with an incorrect password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword' // Use the wrong password
                });
            
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Invalid email or password');
        });
    });
});
// const request = require('supertest');
// const app = require('../server');
// const User = require('../models/User'); // We need the User model for setup

// describe('Auth Routes', () => {

//     // Before each auth test, create a user to test against
//     beforeEach(async () => {
//         await User.create({ 
//             name: 'Test User', 
//             email: 'test@example.com', 
//             password: 'password123', 
//             role: 'tenant' 
//         });
//     });

//     // --- Tests for Authentication Middleware (No Change) ---
//     describe('Auth Middleware', () => {
//         it('should return 401 Unauthorized if no token is provided', async () => {
//             const res = await request(app).get('/api/landlord/properties');
//             expect(res.statusCode).toBe(401);
//         });

//         it('should return 401 Unauthorized for a malformed token', async () => {
//             const res = await request(app).get('/api/landlord/properties').set('Authorization', 'Bearer badtoken');
//             expect(res.statusCode).toBe(401);
//         });
//     });

//     // --- NEW: Tests for Registration Endpoint ---
//     describe('POST /api/auth/register', () => {
//         it('should return 409 Conflict if trying to register with an existing email', async () => {
//             const response = await request(app)
//                 .post('/api/auth/register')
//                 .send({
//                     name: 'Another User',
//                     email: 'test@example.com', // This email already exists from beforeEach
//                     password: 'password123',
//                     role: 'tenant'
//                 });

//             expect(response.statusCode).toBe(409);
//             expect(response.body.message).toBe('User with this email already exists');
//         });
//     });

//     // --- NEW: Tests for Login Endpoint ---
//     describe('POST /api/auth/login', () => {
//         it('should return 401 Unauthorized for login with an incorrect password', async () => {
//             const response = await request(app)
//                 .post('/api/auth/login')
//                 .send({
//                     email: 'test@example.com',
//                     password: 'wrongpassword' // Use the wrong password
//                 });
            
//             expect(response.statusCode).toBe(401);
//             expect(response.body.message).toBe('Invalid email or password');
//         });
//     });
// });
// const request = require('supertest');
// const app = require('../server');

// describe('Auth Middleware', () => {
//     it('should return 401 Unauthorized if no token is provided for a protected route', async () => {
//         const response = await request(app).get('/api/landlord/properties');

//         expect(response.statusCode).toBe(401);
//         expect(response.body.message).toBe('Not authorized, no token');
//     });

//     it('should return 401 Unauthorized for a malformed token', async () => {
//         const response = await request(app)
//             .get('/api/landlord/properties')
//             .set('Authorization', 'Bearer badlyformedtoken');

//         expect(response.statusCode).toBe(401);
//         expect(response.body.message).toBe('Not authorized, token failed');
//     });
// });