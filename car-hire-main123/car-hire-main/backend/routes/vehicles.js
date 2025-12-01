const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// Route to get vehicle image (primary image or specific index)
router.get('/:id/image/:index?', async (req, res) => {
    try {
        const index = req.params.index ? parseInt(req.params.index) : 0;
        
        // Only fetch the image data
        const vehicle = await Vehicle.findById(req.params.id).select('image images');
        if (!vehicle) {
            return res.status(404).send('Vehicle not found');
        }
        
        // Get the requested image
        let imageData;
        if (index === 0 && vehicle.image) {
            imageData = vehicle.image;
        } else if (vehicle.images && vehicle.images[index]) {
            imageData = vehicle.images[index];
        } else {
            return res.status(404).send('Image not found');
        }
        
        // Generate ETag for caching
        const etag = `"${vehicle._id}-${index}-${imageData.data.length}"`;
        
        // Check if browser has a cached version
        if (req.headers['if-none-match'] === etag) {
            return res.status(304).end();
        }
        
        // Set proper headers for image serving
        res.set({
            'Content-Type': imageData.contentType,
            'Content-Length': imageData.data.length,
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            'ETag': etag,
            'Accept-Ranges': 'bytes',
            'Access-Control-Allow-Origin': '*',
            'Cross-Origin-Resource-Policy': 'cross-origin',
            'Vary': 'Accept-Encoding'
        });
        
        res.send(imageData.data);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ message: error.message });
    }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// Update: allow up to 4 images and support single 'image' field as well
const multiUpload = (req, res, next) => {
    const arrayUploader = upload.array('images', 4);
    const singleUploader = upload.single('image');

    // Try array uploader first; if no files and a single file field exists, fall back
    arrayUploader(req, res, function (err) {
        if (err) return next(err);
        if (req.files && req.files.length > 0) return next();
        // Fallback to single file handler
        singleUploader(req, res, function (err2) {
            if (err2) return next(err2);
            // Normalize to req.files for downstream code
            if (req.file) {
                req.files = [req.file];
            }
            return next();
        });
    });
};

// Get all vehicles with optional filters
router.get('/', async (req, res) => {
    try {
        const { minPrice, maxPrice, type } = req.query;
        const filter = {};

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (type) {
            filter.type = type;
        }

        // Don't send image data in the list to improve performance,
        // but include a lightweight imageUrl pointer so frontend can request the image when needed
        const vehicles = await Vehicle.find(filter).select('-image.data -images.data');
        const host = req.get('host');
        const protocol = req.protocol;
        const vehiclesWithUrls = vehicles.map(v => {
            const obj = v.toObject ? v.toObject() : v;
            obj.imageUrl = `${protocol}://${host}/api/vehicles/${obj._id}/image`;
            // Add imageUrls array for all images
            const imageCount = obj.images ? obj.images.length : 1;
            obj.imageUrls = Array.from({ length: imageCount }, (_, i) => 
                `${protocol}://${host}/api/vehicles/${obj._id}/image/${i}`
            );
            return obj;
        });
        res.json(vehiclesWithUrls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single vehicle
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const obj = vehicle.toObject();
        obj.imageUrl = `${req.protocol}://${req.get('host')}/api/vehicles/${obj._id}/image`;
        // Add imageUrls array for all images
        const imageCount = obj.images ? obj.images.length : 1;
        obj.imageUrls = Array.from({ length: imageCount }, (_, i) => 
            `${req.protocol}://${req.get('host')}/api/vehicles/${obj._id}/image/${i}`
        );
        res.json(obj);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new vehicle (admin only)
router.post('/', authMiddleware, multiUpload, async (req, res) => {
    try {
        console.log('Vehicle creation request received');
        console.log('Body:', req.body);
        console.log('Files:', req.files ? req.files.length : 'None');

        // Validate required fields
        const make = (req.body.make || '').trim();
        const model = (req.body.model || '').trim();
        const type = (req.body.type || '').trim();
        const location = (req.body.location || '').trim();
        const seatsRaw = req.body.seats || (req.body.specifications && (() => {
            try { const s = JSON.parse(req.body.specifications); return s.seats; } catch(_) { return undefined; }
        })());
        const seats = seatsRaw !== undefined && seatsRaw !== '' ? Number(seatsRaw) : NaN;

        if (!make || !model || !type || Number.isNaN(seats)) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: make, model, type, seats, image'
            });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'At least one vehicle image is required' 
            });
        }

        // Save the first image as the primary image (required by schema)
        const file = req.files[0];
        const image = {
            data: file.buffer,
            contentType: file.mimetype
        };

        // Save all images in the images array
        const images = req.files.map(f => ({
            data: f.buffer,
            contentType: f.mimetype
        }));

        // Parse specifications if present
        let specifications;
        if (req.body.specifications) {
            try {
                specifications = JSON.parse(req.body.specifications);
            } catch (_) {
                specifications = undefined;
            }
        }

        // Create base vehicle data
        const vehicleData = {
            name: req.body.name || `${make} ${model}`,
            make,
            model,
            type,
            seats,
            image,
            images,
        };

        // Add optional scalar fields if provided
        ['price','description','year','color','licensePlate','vin','fuelEfficiency','location','rating'].forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== '') {
                vehicleData[field] = req.body[field];
            }
        });

        // Add features array if provided as JSON or comma string
        if (req.body.features) {
            try {
                vehicleData.features = JSON.parse(req.body.features);
            } catch (_) {
                vehicleData.features = String(req.body.features)
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
            }
        }

        // If specifications parsed, ensure seats is mirrored and include it
        if (specifications && typeof specifications === 'object') {
            if (specifications.seats === undefined) specifications.seats = seats;
            vehicleData.specifications = specifications;
        } else {
            // Build minimal specifications from individual fields if present
            const specFromFields = {};
            if (req.body.transmission) specFromFields.transmission = req.body.transmission;
            if (req.body.fuelType) specFromFields.fuelType = req.body.fuelType;
            if (Object.keys(specFromFields).length > 0) {
                specFromFields.seats = seats;
                vehicleData.specifications = specFromFields;
            }
        }

        // Save vehicle
        const vehicle = new Vehicle(vehicleData);
        await vehicle.save();

        res.json({ success: true, vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a vehicle (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        
        if (req.file) {
            updates.imageUrl = `/uploads/${req.file.filename}`;
        }

        if (req.body.specifications) {
            updates.specifications = JSON.parse(req.body.specifications);
        }

        if (req.body.features) {
            updates.features = JSON.parse(req.body.features);
        }

        const vehicle = await Vehicle.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a vehicle (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('DELETE /api/vehicles called with id:', id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.warn('Invalid ObjectId received:', id);
            return res.status(400).json({ message: 'Invalid vehicle id' });
        }

        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            console.warn('Vehicle not found for id:', id);
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted', id });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;