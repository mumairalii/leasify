const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Organization = require('../models/Organization');
const mongoose = require('mongoose');

describe('Tenant Maintenance Routes', () => {
    let landlordToken;
    let tenantToken;
    let tenantId;
    let propertyId;
    let orgId;
    let activeLeaseId;

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();

        // 1. Create Landlord
        const landlordRes = await request(app).post('/api/auth/register').send({
            name: 'Test Landlord',
            email: 'maint.landlord@example.com',
            password: 'password123',
            role: 'landlord'
        });
        landlordToken = landlordRes.body.token;
        orgId = landlordRes.body.organization;

        // 2. Create Property
        const propertyRes = await request(app)
            .post('/api/landlord/properties')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({
                address: {
                    street: "123 Leaky Pipe Ln",
                    city: "Testville",
                    state: "TS",
                    zipCode: "12345"
                },
                rentAmount: 1000,
                owner: landlordRes.body._id
            });
        propertyId = propertyRes.body._id;

        // 3. Create Tenant
        const tenantRes = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test Tenant',
                email: 'maint.tenant@example.com',
                password: 'password123',
                role: 'tenant'
            });
        tenantToken = tenantRes.body.token;
        tenantId = tenantRes.body._id;

        // 4. Create an active Lease
        const leaseRes = await request(app)
            .post('/api/landlord/leases/assign')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({
                propertyId,
                tenantEmail: 'maint.tenant@example.com',
                startDate: '2024-01-01',
                endDate: '2025-12-31',
                rentAmount: 1000
            });
        activeLeaseId = leaseRes.body.lease._id;

        // Verify the lease was created successfully
        if (!activeLeaseId) {
            throw new Error('Failed to create lease: ' + JSON.stringify(leaseRes.body));
        }
    });

    describe('POST /api/tenant/maintenance-requests', () => {
        it('should create a new maintenance request for a tenant with an active lease', async () => {
            const requestData = { description: 'The kitchen faucet is dripping.' };
            const response = await request(app)
                .post('/api/tenant/maintenance-requests')
                .set('Authorization', `Bearer ${tenantToken}`)
                .send(requestData);

            expect(response.statusCode).toBe(201);
            expect(response.body.property.toString()).toBe(propertyId.toString());
            expect(response.body.lease.toString()).toBe(activeLeaseId.toString()); // Convert both to strings for comparison
        });
    });

    describe('GET /api/tenant/maintenance-requests', () => {
        it('should fetch all requests for the logged-in tenant', async () => {
            // Create test requests with all required fields
            await MaintenanceRequest.create([{
                tenant: tenantId,
                property: propertyId,
                organization: orgId,
                description: 'First issue',
                lease: activeLeaseId,
                status: 'Pending'
            }, {
                tenant: tenantId,
                property: propertyId,
                organization: orgId,
                description: 'Second issue',
                lease: activeLeaseId,
                status: 'Pending'
            }]);

            const response = await request(app)
                .get('/api/tenant/maintenance-requests')
                .set('Authorization', `Bearer ${tenantToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
            // Verify each request has the required fields
            response.body.forEach(request => {
                expect(request.lease).toBeDefined();
                expect(request.property).toBeDefined();
            });
        });
    });
});