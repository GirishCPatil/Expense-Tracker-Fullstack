const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const sequelize = require('./utils/db');
const userRoutes = require('./routes/userRoutes');
const expRoutes = require('./routes/expRoutes');
const PaymentRoutes = require('./routes/paymentRoutes');
require('./models/index');
const path = require("path");

app.use("/frontend", express.static(path.join(__dirname, "../frontend")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API');
});


app.use('/users', userRoutes);
app.use('/expenses',expRoutes);
app.use('/payment',PaymentRoutes);
app.use('/premium', require('./routes/premiumRoutes'));

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
    })
    .catch(err => {
        console.error('Unable to sync the database:', err);
    }); 

