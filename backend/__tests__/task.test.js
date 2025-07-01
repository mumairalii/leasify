const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');
const mongoose = require('mongoose');

describe('Task Routes', () => {
    let landlordToken;
    let testTask;

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();
        // Setup a landlord user to get a valid token
        const landlordRes = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Task Test Landlord', email: 'task.landlord@example.com', password: 'password123', role: 'landlord' });
        landlordToken = landlordRes.body.token;

        // Create a task to be used in update/delete tests
        const taskRes = await request(app)
            .post('/api/landlord/tasks')
            .set('Authorization', `Bearer ${landlordToken}`)
            .send({ title: 'Initial Task' });
        testTask = taskRes.body;
    });

    describe('POST /api/landlord/tasks', () => {
        it('should create a new task when given valid data', async () => {
            const taskData = { title: 'Pay the water bill' };
            const response = await request(app)
                .post('/api/landlord/tasks')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send(taskData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toHaveProperty('title', 'Pay the water bill');
        });

        it('should return a 400 validation error if the title is missing', async () => {
            const response = await request(app)
                .post('/api/landlord/tasks')
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ title: '' }); // Send empty title

            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Validation failed');
            const titleError = response.body.errors.find(err => err.path === 'title');
            expect(titleError.msg).toBe('Title is required');
        });
    });

    describe('PUT /api/landlord/tasks/:id', () => {
        it('should update a task when given valid data', async () => {
            const response = await request(app)
                .put(`/api/landlord/tasks/${testTask._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ isCompleted: true });

            expect(response.statusCode).toBe(200);
            expect(response.body.isCompleted).toBe(true);
        });

        it('should return a 400 validation error if isCompleted is not a boolean', async () => {
            const response = await request(app)
                .put(`/api/landlord/tasks/${testTask._id}`)
                .set('Authorization', `Bearer ${landlordToken}`)
                .send({ isCompleted: 'yes' }); // Invalid data type

            expect(response.statusCode).toBe(400);
            const statusError = response.body.errors.find(err => err.path === 'isCompleted');
            expect(statusError.msg).toBe('isCompleted must be a boolean');
        });
    });
});