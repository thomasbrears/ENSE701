import express from 'express';
import Roles from '../models/Roles.js';

const router = express.Router();

// Detail
router.get("/:email", async (req, res) => {
    console.log(`"GET /api/score/${req.params.email} - Retrieve a single score by doc ID"`)
    try {
        const roleModel = await Roles.findOne({
            email: req.params.email
        });
        
        if (!roleModel) {
            return res.status(404).json({ message: 'Score not found' });
        }

        return res.status(200).json(roleModel);
    } catch (error) {
        console.error('Error retrieving score by ID:', error);
        return res.status(500).json({ message: 'Error fetching score by ID', error });
    }
})

// Delete
router.delete("/:email", async (req, res) => {
    console.log(`"DELETE /api/emails/${req.params.email} - Delete"`)
    try {
        await Roles.deleteOne({
            email: req.params.email
        });
        return res.status(200).json({ message: 'Email deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting email', error: err });
    }
})

// Update
router.put("/:email", async (req, res) => {
    console.log(`"PUT /api/emails/${req.params.email} - Update"`)
    try {
        const { email, role } = req.body;

        const roleModel = await Roles.findOne({
            email: req.params.email
        });

        if (!roleModel) {
            return res.status(404).json({ message: 'Email not found' });
        }

        roleModel.email = email;
        roleModel.role = role;
        roleModel.save();

        return res.status(200).json(roleModel);
    } catch (error) {
        console.error('Error retrieving score by ID:', error);
        return res.status(500).json({ message: 'Error fetching score by ID', error });
    }
})

// Create
router.post("/", async (req, res) => {
    console.log(`"POST /api/emails - Create"`)
    try {
        const { email, role } = req.body;

        const newRole = new Roles({
            email,
            role
        })

        await newRole.save();
        return res.status(201).json(newRole);
    } catch (error) {
        console.error('Error retrieving all score:', error);
        return res.status(500).json({ message: 'Error fetching score', error });
    }
})

// Get All
router.get("/", async (req, res) => {
    console.log(`"GET /api/emails - Get All"`);
    try {
        const roles = await Roles.find();
        return res.status(200).json(roles);
    } catch (error) {
        console.error('Error retrieving average score by ID:', error);
        return res.status(500).json({ message: 'Error fetching average score by ID', error });
    }
});

export default router;
