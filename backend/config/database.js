const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI must be configured.');
    }

    if (
      process.env.NODE_ENV === 'production' &&
      /\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/.test(uri)
    ) {
      throw new Error('MONGODB_URI must point to a remote MongoDB instance in production.');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

module.exports = connectDB;