const express = require('express');
const cors = require('cors');
const app = express();

const usersRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');
const employeesRoutes = require('./routes/employees');
const appointmentsRoutes = require('./routes/appointments');
const businessHoursRoutes = require('./routes/businessHours');

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin, como Thunder Client/Postman
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(usersRoutes);
app.use(servicesRoutes);
app.use(employeesRoutes);
app.use(appointmentsRoutes);
app.use(businessHoursRoutes);

app.get('/', (req, res) => {
  res.send('API Barbearia rodando 🚀');
});

module.exports = app;