// This check is our firewall. It ensures we only load test variables for tests.
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else {
  // Fallback for safety, though the npm script should prevent this.
  require('dotenv').config();
}

const mongoose = require('mongoose');

jest.setTimeout(30000); // 30-second timeout for all tests

// This block runs ONCE before all test suites
beforeAll(async () => {
  if (!process.env.MONGO_URI || !process.env.MONGO_URI.includes('_TEST')) {
      throw new Error('FATAL: Test suite is not configured to use the TEST database. Check your .env.test file and test script.');
  }
  // This will now connect to leaseifyDB_TEST when running `npm test`
  await mongoose.connect(process.env.MONGO_URI);
});

// This block runs ONCE after all test suites
afterAll(async () => {
  // This will now drop the leaseifyDB_TEST database
  await mongoose.connection.db.dropDatabase();
  // Close the connection so Jest can exit cleanly
  await mongoose.connection.close();
});