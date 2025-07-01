const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Property = require('../models/Property');
const mongoose = require('mongoose');

describe('Lease Routes', () => {
    let landlordToken;
    let testProperty;
    let landlordId;

    // Before each test, set up a landlord and a property
    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();

        // Setup Landlord
        const landlordRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test Landlord', email: 'lease.landlord@example.com', password: 'password123', role: 'landlord' });
        landlordToken = landlordRes.body.token;
        landlordId = landlordRes.body._id;

        // Setup Property
        const propertyRes = await request(app)
            .post('/api/landlord/properties')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({
                address: { street: "123 Lease St", city: "Leaseville", state: "LS", zipCode: "54321" },
                rentAmount: 1100
            });
        testProperty = propertyRes.body;
    });

    describe('POST /api/landlord/leases/assign', () => {
        it('should return a 400 error if the tenantEmail is missing', async () => {
            const leaseData = {
                propertyId: testProperty._id,
                // Missing tenantEmail
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                rentAmount: 1100
            };

            const response = await request(app)
                .post('/api/landlord/leases/assign')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(leaseData);

            expect(response.statusCode).toBe(400);
            // Check that the response contains an 'errors' array
            expect(response.body).toHaveProperty('errors');
            // Check for the specific error message from your validator
            const emailError = response.body.errors.find(e => e.path === 'tenantEmail');
            expect(emailError.msg).toBe('A valid tenant email is required');
        });

        it('should return a 400 error if the startDate is an invalid date', async () => {
            const leaseData = {
                propertyId: testProperty._id,
                tenantEmail: 'tenant@example.com',
                startDate: 'not-a-real-date', // Invalid date
                endDate: '2024-12-31',
                rentAmount: 1100
            };

            const response = await request(app)
                .post('/api/landlord/leases/assign')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(leaseData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('errors');
            const dateError = response.body.errors.find(e => e.path === 'startDate');
            expect(dateError.msg).toBe('A valid start date is required');
        });

        it('should return a 400 error if rentAmount is not a number', async () => {
            const leaseData = {
                propertyId: testProperty._id,
                tenantEmail: 'tenant@example.com',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                rentAmount: 'one thousand dollars' // Not a number
            };

            const response = await request(app)
                .post('/api/landlord/leases/assign')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(leaseData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('errors');
            const rentError = response.body.errors.find(e => e.path === 'rentAmount');
            expect(rentError.msg).toBe('Rent amount must be a number');
        });
    });
});