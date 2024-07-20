require('module-alias/register');
const connectDB = require('./src/config/database');
const logger = require('@/config/logger');
require('colors');

const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}
require('dotenv').config({ path: '.env' });

// connect database
connectDB();

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  logger.info(`Express running → On PORT : ${server.address().port}`.blue);
});