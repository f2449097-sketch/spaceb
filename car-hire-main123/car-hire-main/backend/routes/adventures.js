const express = require('express');
const router = express.Router();
const Adventure = require('../models/Adventure');
const authMiddleware = require('../middleware/auth');

// List all adventures
router.get('/', async (req, res) => {
    try {
        const adventures = await Adventure.find().sort({ createdAt: -1 });
        
        // Auto-fix: Initialize bookedSeats for adventures that don't have it
        let fixed = 0;
        for (const adv of adventures) {
            if (adv.bookedSeats === undefined || adv.bookedSeats === null) {
                adv.bookedSeats = 0;
                await adv.save();
                fixed++;
                console.log(`✅ Auto-fixed: ${adv.title} → bookedSeats: 0`);
            }
        }
        if (fixed > 0) {
            console.log(`🔧 Auto-fixed ${fixed} adventure(s)`);
        }
        
        // Reload adventures to get updated data with virtuals
        const updatedAdventures = await Adventure.find().sort({ createdAt: -1 });
        
        // Log seat information for debugging
        console.log('=== Adventures Seat Status ===');
        updatedAdventures.forEach(adv => {
            console.log(`${adv.title}: max=${adv.maxParticipants}, booked=${adv.bookedSeats}, available=${adv.availableSeats}`);
        });
        
        res.json({ success: true, adventures: updatedAdventures });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
});

// Get one
router.get('/:id', async (req, res) => {
    try {
        const adv = await Adventure.findById(req.params.id);
        if (!adv) return res.status(404).json({ success: false, message: 'Not found' });
        
        // Auto-fix: Initialize bookedSeats if missing
        if (adv.bookedSeats === undefined || adv.bookedSeats === null) {
            adv.bookedSeats = 0;
            await adv.save();
            console.log(`✅ Auto-fixed: ${adv.title} → bookedSeats: 0`);
        }
        
        res.json({ success: true, adventure: adv });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
});

// Create (admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const adv = new Adventure(req.body);
        await adv.save();
        res.status(201).json({ success: true, adventure: adv });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
});

// Update (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const adv = await Adventure.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!adv) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, adventure: adv });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
});

// Delete (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete request received for adventure ID:', id);
        
        // Validate ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log('Invalid ID format:', id);
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid adventure ID format' 
            });
        }
        
        // Validate adventure exists
        const adventure = await Adventure.findById(id);
        if (!adventure) {
            console.log('Adventure not found with ID:', id);
            return res.status(404).json({ 
                success: false, 
                message: 'Adventure not found'
            });
        }
        
        console.log('Found adventure to delete:', adventure);

        // Delete the adventure
        await Adventure.findByIdAndDelete(id);
        res.json({ 
            success: true, 
            message: 'Adventure deleted successfully',
            id: id 
        });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
});

module.exports = router;




