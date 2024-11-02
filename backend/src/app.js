const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandlers = require('./handlers/errorHandlers');

const isValidAuthToken = require('./middlewares/isValidAuthToken');

// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// Here our API Routes
const authRoute = require('./routes/authRoute');
const appRouter = require('./routes/appRoutes/appApi');
const coreDownloadRouter = require('./routes/coreDownloadRouter');
// const updateDebtStartForSuppliers = require('./controllers/appControllers/supplierController/schedule');

// har oy tugaganda debtEnd dan debtStart ga o'tkazadi
// updateDebtStartForSuppliers();

app.use('/api/auth', authRoute);
app.use('/api', isValidAuthToken, appRouter);
app.use('/download', coreDownloadRouter);

app.use('/public', express.static('src/public'));
// app.use(express.static(path.join(__dirname, '../../frontend/')));

// Barcha yo'nalishlar uchun `index.html` xizmat qilish
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/', 'index.html'));
// });

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.developmentErrors);

module.exports = app;
