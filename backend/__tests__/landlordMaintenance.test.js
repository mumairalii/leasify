const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const mongoose = require('mongoose');

describe('Landlord Maintenance Routes', () => {
    let landlordToken;
    let testMaintenanceRequest;

    // Before each test, set up a landlord, tenant, property, lease, and a maintenance request
    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();

        // 1. Create Landlord
        const landlordRes = await request(app).post('/api/auth/register')
            .send({ name: 'Landlord User', email: 'landlord.maint@example.com', password: 'password123', role: 'landlord' });
        landlordToken = landlordRes.body.token;

        // 2. Create Property
        const propertyRes = await request(app).post('/api/landlord/properties')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({ address: { street: "123 Broken Faucet Dr", city: "Fixitville", state: "FV", zipCode: "54321" }, rentAmount: 1300 });

        // 3. Create Tenant
        const tenantRes = await request(app).post('/api/auth/register')
            .send({ name: 'Tenant User', email: 'tenant.maint@example.com', password: 'password123', role: 'tenant' });
        const tenantToken = tenantRes.body.token;
        
        // 4. Create Lease to link them
        await request(app).post('/api/landlord/leases/assign')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({ propertyId: propertyRes.body._id, tenantEmail: 'tenant.maint@example.com', startDate: '2024-01-01', endDate: '2025-12-31', rentAmount: 1300 });

        // 5. As the Tenant, create a maintenance request for the landlord to manage
        const maintRes = await request(app).post('/api/tenant/maintenance-requests')
            .set('Authorization', `Bearer ${tenantToken}`)
            .send({ description: 'The main door is creaking loudly.' });
        
        testMaintenanceRequest = maintRes.body;
    });

    describe('GET /api/landlord/maintenance-requests', () => {
        it('should fetch all maintenance requests for the landlord\'s organization', async () => {
            const response = await request(app)
                .get('/api/landlord/maintenance-requests')
                .set('Authorization', `Bearer ${landlordToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0].description).toBe('The main door is creaking loudly.');
            expect(response.body[0]).toHaveProperty('tenant'); // Check that tenant info is populated
            expect(response.body[0].tenant.name).toBe('Tenant User');
        });
    });

    describe('PUT /api/landlord/maintenance-requests/:id', () => {
        it('should update the status of a maintenance request successfully', async () => {
            const response = await request(app)
                .put(`/api/landlord/maintenance-requests/${testMaintenanceRequest._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ status: 'In Progress' });

            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('In Progress');
        });

        it('should return a 400 validation error for an invalid status', async () => {
            const response = await request(app)
                .put(`/api/landlord/maintenance-requests/${testMaintenanceRequest._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ status: 'Done' }); // "Done" is not a valid status from our enum

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            const statusError = response.body.errors.find(err => err.path === 'status');
            expect(statusError.msg).toBe('A valid status is required');
        });
    });

    describe('DELETE /api/landlord/maintenance-requests/:id', () => {
        it('should delete a maintenance request successfully', async () => {
            const response = await request(app)
                .delete(`/api/landlord/maintenance-requests/${testMaintenanceRequest._id}`)
                .set('Authorization', `Bearer ${landlordToken}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(testMaintenanceRequest._id);

            // Verify it's actually gone
            const check = await MaintenanceRequest.findById(testMaintenanceRequest._id);
            expect(check).toBeNull();
        });
    });
});