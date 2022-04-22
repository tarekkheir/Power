const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/routes');
const db = require('./models');

// Instantiate server
const app = express();

// Parse configuration
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Launch server
app.listen(8080, () => {
    console.log('Server running on 8080 !');
})

// Configures routes
app.use('/', authRoutes);

// Check DB connection and Create tables if it doesn't exist
db.sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err));
db.sequelize.sync()
    .then(() => console.log('Database sync !'))
    .catch((err) => console.log(err));
