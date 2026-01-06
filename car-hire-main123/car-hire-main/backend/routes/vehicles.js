const express = require('express');
const router = express.Router();
const multer = require('multer');
const Vehicle = require('../models/Vehicle');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
const { storage, cloudinary } = require('../config/cloudinary');

const upload = multer({ storage: storage });

// Update: allow up to 4 images and support single 'image' field as well
const multiUpload = (req, res, next) => {
    const arrayUploader = upload.array('images', 4);
    const singleUploader = upload.single('image');

    // Try array uploader first
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

// Get all vehicles
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

        // Get vehicles - handle both old format (Buffer) and new format (URL strings)
        const vehicles = await Vehicle.find(filter);
        
        // Transform vehicles to ensure image fields are URLs (handle old Buffer format)
        const vehiclesWithUrls = vehicles.map(v => {
            const obj = v.toObject ? v.toObject() : v;
            
            // Handle old format: image is { data: Buffer, contentType: String }
            if (obj.image && typeof obj.image === 'object' && obj.image.data) {
                // Old format - convert to data URL or set to null (can't serve Buffer directly anymore)
                // For old vehicles, you'll need to re-upload images or they won't display
                obj.image = null;
                obj.hasOldImageFormat = true;
            }
            
            // Handle old format: images array contains Buffer objects
            if (obj.images && Array.isArray(obj.images)) {
                obj.images = obj.images.map(img => {
                    if (typeof img === 'object' && img.data) {
                        // Old Buffer format - can't convert, set to null
                        return null;
                    }
                    return img; // Already a URL string
                }).filter(Boolean); // Remove nulls
            }
            
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
        
        const obj = vehicle.toObject ? vehicle.toObject() : vehicle;
        
        // Handle old format: image is { data: Buffer, contentType: String }
        if (obj.image && typeof obj.image === 'object' && obj.image.data) {
            obj.image = null;
            obj.hasOldImageFormat = true;
        }
        
        // Handle old format: images array contains Buffer objects
        if (obj.images && Array.isArray(obj.images)) {
            obj.images = obj.images.map(img => {
                if (typeof img === 'object' && img.data) {
                    return null; // Old Buffer format
                }
                return img; // Already a URL string
            }).filter(Boolean);
        }
        
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

        // Use Cloudinary URLs
        // req.files would have .path (which is the Cloudinary URL) due to multer-storage-cloudinary
        const image = req.files[0].path;
        const images = req.files.map(f => f.path);

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
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update a vehicle (admin only)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        
        if (req.file) {
            updates.image = req.file.path;
        }

        if (req.body.specifications) {
             try {
                updates.specifications = JSON.parse(req.body.specifications);
            } catch (e) {
                 // ignore parsing error or handle it
            }
        }

        if (req.body.features) {
             try {
                updates.features = JSON.parse(req.body.features);
            } catch (e) {
                 // ignore
            }
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

// Toggle vehicle availability (admin only)
router.patch('/:id/availability', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid vehicle id' });
        }

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Toggle the availability
        vehicle.availability = !vehicle.availability;
        await vehicle.save();

        console.log(`Vehicle ${id} availability toggled to: ${vehicle.availability}`);

        res.json({ 
            success: true, 
            vehicle,
            message: `Vehicle is now ${vehicle.availability ? 'available' : 'unavailable'}`
        });
    } catch (error) {
        console.error('Error toggling vehicle availability:', error);
        res.status(500).json({ message: error.message });
    }
});

// Helper function to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    try {
        // Cloudinary URL format: https://res.cloudinary.com/[cloud]/image/upload/[version]/[folder]/[public_id].[ext]
        // We need "[folder]/[public_id]"
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        if (uploadIndex === -1) return null;
        
        // Everything after 'v12345678/' or the version part
        const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
        // Remove extension
        return publicIdWithExt.split('.')[0];
    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
};

// Delete a vehicle (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid vehicle id' });
        }

        // 1. Find the vehicle first to get image URLs
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // 2. Identify images to delete from Cloudinary
        const imagesToDelete = [];
        if (vehicle.image) imagesToDelete.push(vehicle.image);
        if (vehicle.images && Array.isArray(vehicle.images)) {
            vehicle.images.forEach(img => {
                if (img && !imagesToDelete.includes(img)) {
                    imagesToDelete.push(img);
                }
            });
        }

        // 3. Delete from Cloudinary
        const deletionPromises = imagesToDelete
            .map(url => getPublicIdFromUrl(url))
            .filter(Boolean)
            .map(publicId => {
                console.log(`[Cloudinary Cleanup] Deleting public_id: ${publicId}`);
                return cloudinary.uploader.destroy(publicId);
            });

        await Promise.all(deletionPromises);

        // 4. Delete from MongoDB
        await Vehicle.findByIdAndDelete(id);
        
        res.json({ 
            success: true, 
            message: 'Vehicle and associated cloud images deleted successfully', 
            id,
            imagesDeletedCount: deletionPromises.length
        });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;