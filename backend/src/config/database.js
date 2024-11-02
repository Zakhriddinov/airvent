const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('./logger');
require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB connected to: ${conn.connection.host}`.green.underline);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`.red.underline);
    process.exit(1);
  }
};

module.exports = connectDB;
