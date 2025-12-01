const mongoose = require('mongoose');
const { ServerApiVersion } = require('mongodb');

const connectDB = async () => {
    try {
        const uri = "mongodb+srv://spaceborne:bornespace%402030@spaceborne.moqedze.mongodb.net/car-hire?retryWrites=true&w=majority&appName=spaceborne";
        
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });

        console.log("Connected to MongoDB Atlas!");
        console.log(`Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;