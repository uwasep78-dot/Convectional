require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const reset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    const email = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 16) {
      throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters before resetting.');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const res = await User.updateOne({ email }, { $set: { password: hash, isActive: true, role: 'superadmin' } });
    console.log('matched:', res.matchedCount, 'modified:', res.modifiedCount);
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

reset();
