require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    const email = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.trim();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 16) {
      throw new Error('Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 16 characters before seeding.');
    }

    let user = await User.findOne({ email });
    if (user) {
      user.role = 'superadmin';
      user.isActive = true;
      await user.save();
      console.log(`Admin user updated: ${email} (role: superadmin)`);
    } else {
      user = await User.create({
        name: 'CCR Administrator',
        email,
        password,
        phone: '+250 783 024 760',
        role: 'superadmin',
        isActive: true,
      });
      console.log(`Admin user created: ${email} (role: superadmin)`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();