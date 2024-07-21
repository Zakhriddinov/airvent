const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandlers = require('./handlers/errorHandlers');

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

app.use(express.static(path.join(__dirname, 'public_html')));

// Barcha yo'nalishlar uchun `index.html` xizmat qilish
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Here our API Routes
const authRoute = require('./routes/authRoute');
const appRouter = require('./routes/appRoutes/appApi');

app.use('/api/auth', authRoute);
app.use('/api', appRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.developmentErrors);

module.exports = app;
