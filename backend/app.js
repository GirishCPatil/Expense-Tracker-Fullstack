const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const sequelize = require('./utils/db');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API');
});


app.use('/users', userRoutes);

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

