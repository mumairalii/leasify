// This check is our firewall. It ensures we only load test variables for tests.
if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: './.env.test' });
} else {
  require('dotenv').config();
}

const mongoose = require('mongoose');

jest.setTimeout(30000); // Set a generous timeout

beforeAll(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined. Check your .env files.');
  }
  // This will now connect to leaseifyDB_TEST when running `npm test`
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // This will now drop the leaseifyDB_TEST database
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

// const mongoose = require('mongoose');

// // This line is the firewall. It explicitly loads the .env.test file.
// if (process.env.NODE_ENV === 'test') {
//     require('dotenv').config({ path: './.env.test' });
// }

// jest.setTimeout(30000);

// // This now safely connects to your TEST database
// beforeAll(async () => {
//     if (!process.env.MONGO_URI) {
//         throw new Error('MONGO_URI must be defined in your .env.test file');
//     }
//     await mongoose.connect(process.env.MONGO_URI);
// });

// // This now safely cleans your TEST database before each test
// beforeEach(async () => {
//     const collections = mongoose.connection.collections;
//     for (const key in collections) {
//         await collections[key].deleteMany({});
//     }
// });

// // This now safely drops your TEST database after all tests
// afterAll(async () => {
//     await mongoose.connection.dropDatabase();
//     await mongoose.connection.close();
// });