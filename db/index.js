const mongoose = require('mongoose')

const connectDB = async () => {
     try {
        await mongoose.connect('mongodb://localhost:/blogdb')
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
}

module.exports = { connectDB}