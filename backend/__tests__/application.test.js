const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const Application = require('../models/Application');
const mongoose = require('mongoose');

describe('Application Routes', () => {
    let landlordToken;
    let tenantAToken;
    let tenantAId;
    let tenantBId;
    let testProperty;
    let testApplication;

    // Before each test, set up a full scenario
    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();

        // 1. Create a Landlord and their Organization
        const landlordRes = await request(app).post('/api/auth/register').send({ name: 'Test Landlord', email: 'landlord@example.com', password: 'password123', role: 'landlord' });
        landlordToken = landlordRes.body.token;

        // 2. Create a Property for the Landlord
        const propertyRes = await request(app).post('/api/landlord/properties').set('Authorization', `Bearer ${landlordToken}`).send({
            address: { street: "123 Vacant St", city: "Applytown", state: "AP", zipCode: "54321" },
            rentAmount: 1200
        });
        testProperty = propertyRes.body;

        // 3. Create Tenant A, who will apply for the property
        const tenantARes = await request(app).post('/api/auth/register').send({ name: 'Applicant Tenant', email: 'tenant.a@example.com', password: 'password123', role: 'tenant' });
        tenantAToken = tenantARes.body.token;
        tenantAId = tenantARes.body._id;
        
        // 4. Create Tenant B, who will already have a lease in one test
        const tenantBRes = await request(app).post('/api/auth/register').send({ name: 'Existing Tenant', email: 'tenant.b@example.com', password: 'password123', role: 'tenant' });
        tenantBId = tenantBRes.body._id;

        // 5. As Tenant A, submit an application for the property
        const appRes = await request(app).post('/api/applications').set('Authorization', `Bearer ${tenantAToken}`).send({
            propertyId: testProperty._id,
            message: 'I am a great tenant!'
        });
        testApplication = appRes.body;
    });

    describe('PUT /api/applications/:id (Approve/Reject)', () => {
        
        it('should approve the application and create a new lease for a vacant property', async () => {
            // Action: Landlord approves Tenant A's application
            const response = await request(app)
                .put(`/api/applications/${testApplication._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ status: 'Approved' });

            // Assertions for the API response
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe('Approved');

            // Assertions for the database state (the consequences)
            const newLease = await Lease.findOne({ tenant: tenantAId });
            expect(newLease).not.toBeNull();
            expect(newLease.property.toString()).toBe(testProperty._id);
            expect(newLease.status).toBe('active');
        });

        it('should return 409 Conflict when approving an application for an already leased property', async () => {
            // Setup: Manually create a lease for Tenant B on the same property
            await Lease.create({
                property: testProperty._id,
                tenant: tenantBId,
                organization: testProperty.organization,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                rentAmount: testProperty.rentAmount,
                status: 'active'
            });

            // Action: Landlord tries to approve Tenant A's application for the now-rented property
            const response = await request(app)
                .put(`/api/applications/${testApplication._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ status: 'Approved' });
            
            // Assertions for the API response
            expect(response.statusCode).toBe(409);
            expect(response.body.message).toBe('This property has already been assigned an active lease.');

            // Assertions for the database state (the consequences)
            const leaseForTenantA = await Lease.findOne({ tenant: tenantAId });
            expect(leaseForTenantA).toBeNull(); // Ensure no new lease was created for Tenant A
        });
    });
});