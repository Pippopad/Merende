// Importa le librerie
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

// Carica il file di configurazione (.env)
dotenv.config();

// Connect to the database
const conn = require('./connection');

// Variabili contenenti le routes
const authRoute = require('./routes/auth');
const ordersRoute = require('./routes/orders');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/orders', ordersRoute);

// Carica dal file di configurazione la porta che il server userà (default 5000)
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}!`);
});
