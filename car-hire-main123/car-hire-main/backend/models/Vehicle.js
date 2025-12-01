const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    },
    images: [{
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    }],
    make: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['SUV', 'Sedan', 'Van', 'Truck', 'Luxury'] // Add other types as needed
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: false,
        min: 0
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    features: [{
        type: String,
        trim: true
    }],
    specifications: {
        transmission: {
            type: String,
            required: false,
            enum: ['Manual', 'Automatic']
        },
        fuelType: {
            type: String,
            required: false,
            enum: ['Petrol', 'Diesel', 'Hybrid', 'Electric']
        }
    },
    availability: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    // Additional fields for enhanced vehicle information
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    color: {
        type: String,
        trim: true
    },
    licensePlate: {
        type: String,
        trim: true
    },
    vin: {
        type: String,
        trim: true
    },
    fuelEfficiency: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);