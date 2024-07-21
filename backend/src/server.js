const connectDB = require('./config/database');
const logger = require('./config/logger');
require('colors');
const http = require('http');
const express = require('express');

const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}
require('dotenv').config({ path: '.env' });

// connect database
connectDB();

// Create Express app
const app = express();

const checkPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(port, () => {
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      reject(port);
    });
  });
};

const getAvailablePort = async (startPort) => {
  let port = startPort;
  while (true) {
    try {
      await checkPort(port);
      return port;
    } catch (err) {
      port++;
    }
  }
};

const startServer = async () => {
  const port = await getAvailablePort(process.env.PORT || 8888);
  app.set('port', port);
  const server = app.listen(port, () => {
    logger.info(`Express running → On PORT : ${server.address().port}`.blue);
  });
};

startServer();
