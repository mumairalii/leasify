const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Organization = require('../models/Organization');
const Property = require('../models/Property');
const Lease = require('../models/Lease');
const mongoose = require('mongoose');

describe('Property Routes', () => {
    let landlordToken;
    let tenantToken;
    let tenantId;
    let testProperty; // This will now store the response body of the created property

    // This setup runs fresh before EACH test, creating isolated data via API calls
    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();

        // --- Setup Landlord ---
        const landlordRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test Landlord', email: 'landlord.test@example.com', password: 'password123', role: 'landlord' });
        landlordToken = landlordRes.body.token;

        // --- Setup Tenant ---
        const tenantRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test Tenant', email: 'prop.test.tenant@example.com', password: 'password123', role: 'tenant' });
        tenantToken = tenantRes.body.token;
        tenantId = tenantRes.body._id; // Store tenantId for lease creation
        
        // --- THIS IS THE FIX ---
        // Create a property using the API to ensure all business logic is applied
        const propertyResponse = await request(app)
            .post('/api/landlord/properties')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({
                address: { street: "123 Main St", city: "Anytown", state: "AN", zipCode: "12345" },
                rentAmount: 1000
            });
        
        testProperty = propertyResponse.body; // Store the created property object
    });

    // --- Test for POST /api/landlord/properties ---
    describe('POST /api/landlord/properties', () => {
        it('should create a second property successfully', async () => {
            const propertyData = {
                address: { street: "456 New Ave", city: "Newville", state: "NV", zipCode: "54321" },
                rentAmount: 2500
            };

            const response = await request(app)
                .post('/api/landlord/properties')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(propertyData);

            expect(response.statusCode).toBe(201);
            expect(response.body.address.street).toBe("456 New Ave");
        });

        it('should return 403 Forbidden if a tenant tries to create a property', async () => {
            const propertyData = { address: { street: "789 Denied Dr", city: "Nope", state: "NO", zipCode: "00000" }, rentAmount: 3000 };
            const response = await request(app)
                .post('/api/landlord/properties')
                .set('Authorization', `Bearer ${tenantToken}`)
                .send(propertyData);

            expect(response.statusCode).toBe(403);
        });
    });

    // --- Tests for PUT /api/landlord/properties/:id ---
    describe('PUT /api/landlord/properties/:id', () => {
        it('should update the property when given valid data and the correct landlord token', async () => {
            const updateData = { rentAmount: 1250 };
            
            const response = await request(app)
                .put(`/api/landlord/properties/${testProperty._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(updateData);

            expect(response.statusCode).toBe(200);
            expect(response.body.rentAmount).toBe(1250);
        });
    });

    // --- Tests for DELETE /api/landlord/properties/:id ---
    describe('DELETE /api/landlord/properties/:id', () => {
        it('should delete the property when it has no active lease', async () => {
            const response = await request(app)
                .delete(`/api/landlord/properties/${testProperty._id}`)
                .set('Authorization', `Bearer ${landlordToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(testProperty._id.toString());
        });

        it('should return 400 Bad Request when trying to delete a property with an active lease', async () => {
            // Create an active lease linked to our test property
            await Lease.create({
                property: testProperty._id,
                tenant: tenantId,
                organization: testProperty.organization,
                startDate: new Date('2024-01-01'),
                endDate: new Date('2025-12-31'),
                rentAmount: 1000,
                status: 'active'
            });

            const response = await request(app)
                .delete(`/api/landlord/properties/${testProperty._id}`)
                .set('Authorization', `Bearer ${landlordToken}`);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Cannot delete a property with an active lease. Please end the lease first.');
        });

        it('should return 404 Not Found if a landlord tries to delete a property from another organization', async () => {
            // Create a second landlord
            const otherLandlordRes = await request(app).post('/api/auth/register').send({ name: 'Other Landlord', email: 'other@example.com', password: 'password123', role: 'landlord' });
            const otherToken = otherLandlordRes.body.token;

            // Attempt to delete the first landlord's property using the second landlord's token
            const response = await request(app)
                .delete(`/api/landlord/properties/${testProperty._id}`)
                .set('Authorization', `Bearer ${otherToken}`);

            expect(response.statusCode).toBe(404);
        });
    });
});
// const request = require('supertest');
// const app = require('../server');
// const User = require('../models/User');
// const Organization = require('../models/Organization');
// const Property = require('../models/Property');
// const mongoose = require('mongoose');
// const Lease = require('../models/Lease');
// describe('Property Routes', () => {
//     let landlordToken;
//     let tenantToken;
//     let landlordId;
//     let orgId;
//     let testProperty; // We'll store a created property here to use in update/delete tests

//     // This setup runs fresh before EACH test, creating isolated data
//     beforeEach(async () => {
//         await mongoose.connection.db.dropDatabase();

//         // Setup Landlord
//         const landlordRes = await request(app)
//             .post('/api/auth/register')
//             .send({ name: 'Test Landlord', email: 'landlord.test@example.com', password: 'password123', role: 'landlord' });
//         landlordToken = landlordRes.body.token;
//         landlordId = landlordRes.body._id;
//         orgId = landlordRes.body.organization;

//         // Setup Tenant
//         const tenantRes = await request(app)
//             .post('/api/auth/register')
//             .send({ name: 'Test Tenant', email: 'prop.test.tenant@example.com', password: 'password123', role: 'tenant' });
//         tenantToken = tenantRes.body.token;
        
//         // Create a property to be used in update and delete tests
//         testProperty = await Property.create({
//             address: { street: "123 Main St", city: "Anytown", state: "AN", zipCode: "12345" },
//             rentAmount: 1000,
//             owner: landlordId,
//             organization: orgId,
//         });
//     });

//     // --- Test for POST /api/landlord/properties ---
//     describe('POST /api/landlord/properties', () => {
//         it('should create a new property with valid data and a landlord token', async () => {
//             const propertyData = {
//                 address: { street: "456 New Ave", city: "Newville", state: "NV", zipCode: "54321" },
//                 rentAmount: 2500
//             };

//             const response = await request(app)
//                 .post('/api/landlord/properties')
//                 .set('Authorization', `Bearer ${landlordToken}`)
//                 .send(propertyData);

//             expect(response.statusCode).toBe(201);
//             expect(response.body).toHaveProperty('_id');
//             expect(response.body.address.street).toBe("456 New Ave");
//         });

//         it('should return 403 Forbidden if a tenant tries to create a property', async () => {
//             const propertyData = { address: { street: "789 Denied Dr", city: "Nope", state: "NO", zipCode: "00000" }, rentAmount: 3000 };
//             const response = await request(app)
//                 .post('/api/landlord/properties')
//                 .set('Authorization', `Bearer ${tenantToken}`)
//                 .send(propertyData);

//             expect(response.statusCode).toBe(403);
//         });
//     });

//     // --- NEW: Tests for PUT /api/landlord/properties/:id ---
//     describe('PUT /api/landlord/properties/:id', () => {
//         it('should update the property when given valid data and a valid landlord token', async () => {
//             const updateData = { rentAmount: 1250, "address.city": "Updated City" };
            
//             const response = await request(app)
//                 .put(`/api/landlord/properties/${testProperty._id}`)
//                 .set('Authorization', `Bearer ${landlordToken}`)
//                 .send(updateData);

//             expect(response.statusCode).toBe(200);
//             expect(response.body.rentAmount).toBe(1250);
//             expect(response.body.address.city).toBe("Updated City");
//         });

//         it('should return 404 Not Found if trying to update a non-existent property', async () => {
//             const nonExistentId = new mongoose.Types.ObjectId();
//             const response = await request(app)
//                 .put(`/api/landlord/properties/${nonExistentId}`)
//                 .set('Authorization', `Bearer ${landlordToken}`)
//                 .send({ rentAmount: 9999 });

//             expect(response.statusCode).toBe(404);
//         });
//     });

//     // --- NEW: Tests for DELETE /api/landlord/properties/:id ---
//     describe('DELETE /api/landlord/properties/:id', () => {
//         it('should delete the property when given a valid landlord token', async () => {
//             const response = await request(app)
//                 .delete(`/api/landlord/properties/${testProperty._id}`)
//                 .set('Authorization', `Bearer ${landlordToken}`);

//             expect(response.statusCode).toBe(200);
//             expect(response.body.id).toBe(testProperty._id.toString());

//             // Verify the property is actually gone from the database
//             const propertyInDb = await Property.findById(testProperty._id);
//             expect(propertyInDb).toBeNull();
//         });

//         it('should return 404 Not Found if a landlord tries to delete a property from another organization', async () => {
//             // Create a second landlord and token
//             const otherLandlordRes = await request(app).post('/api/auth/register').send({ name: 'Other Landlord', email: 'other@example.com', password: 'password123', role: 'landlord' });
//             const otherToken = otherLandlordRes.body.token;

//             // Attempt to delete the first landlord's property using the second landlord's token
//             const response = await request(app)
//                 .delete(`/api/landlord/properties/${testProperty._id}`)
//                 .set('Authorization', `Bearer ${otherToken}`);

//             expect(response.statusCode).toBe(404);
//         });
//     });
// });

// const request = require('supertest');
// const app = require('../server');
// const User = require('../models/User');
// const Organization = require('../models/Organization');

// describe('Property Routes', () => {
//     let landlordToken;
//     let tenantToken;
//     let landlordId;
//     let orgId;

//     // This setup runs before each test, creating fresh data every time.
//     // The database is already clean thanks to our jest.setup.js file.
//     beforeEach(async () => {
//         // Setup Landlord by calling the actual registration API
//         const landlordRes = await request(app)
//             .post('/api/auth/register')
//             .send({ name: 'Test Landlord', email: 'landlord.test@example.com', password: 'password123', role: 'landlord' });
        
//         landlordToken = landlordRes.body.token;
//         landlordId = landlordRes.body._id;
//         orgId = landlordRes.body.organization;

//         // Setup Tenant
//         const tenantRes = await request(app)
//             .post('/api/auth/register')
//             .send({ name: 'Test Tenant', email: 'prop.test.tenant@example.com', password: 'password123', role: 'tenant' });

//         tenantToken = tenantRes.body.token;
//     });

//     // NOTE: We no longer need an afterEach or afterAll block in this file.

//     describe('POST /api/landlord/properties', () => {
//         it('should create a new property when given valid data and a landlord token', async () => {
//             const propertyData = {
//                 address: { street: "123 Test St", city: "Testville", state: "TS", zipCode: "12345" },
//                 rentAmount: 1500,
//             };

//             const response = await request(app)
//                 .post('/api/landlord/properties')
//                 .set('Authorization', `Bearer ${landlordToken}`)
//                 .send(propertyData);

//             expect(response.statusCode).toBe(201);
//             expect(response.body).toHaveProperty('_id');
//             // Check that the returned property is linked to the correct organization
//             expect(response.body.organization).toBe(orgId);
//         });

//         it('should return 403 Forbidden if a tenant tries to create a property', async () => {
//             const propertyData = {
//                 address: { street: "456 Forbidden Ave", city: "Testville", state: "TS", zipCode: "12345" },
//                 rentAmount: 2000,
//             };

//             const response = await request(app)
//                 .post('/api/landlord/properties')
//                 .set('Authorization', `Bearer ${tenantToken}`)
//                 .send(propertyData);

//             expect(response.statusCode).toBe(403);
//             expect(response.body.message).toBe('Access Denied: Landlord role required.');
//         });
//     });
// });