import express from 'express';
import Email from '../models/EMail.js';

const router = express.Router();

// Detail
router.get("/:id", async (req, res) => {
    console.log(`"GET /api/score/${req.params.id} - Retrieve a single score by doc ID"`)
    try {
        const email = await Email.find({
            doc_id: req.params.id
        });
        
        if (!email) {
            return res.status(404).json({ message: 'Score not found' });
        }

        return res.status(200).json(email);
    } catch (error) {
        console.error('Error retrieving score by ID:', error);
        return res.status(500).json({ message: 'Error fetching score by ID', error });
    }
})

// Delete
router.delete("/:id", async (req, res) => {
    console.log(`"DELETE /api/emails/${req.params.id} - Delete"`)
    try {
        await Email.deleteOne({
            doc_id: req.params.id
        });
        return res.status(200).json({ message: 'Email deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting email', error: err });
    }
})

// Update
router.put("/:id", async (req, res) => {
    console.log(`"PUT /api/emails/${req.params.id} - Update"`)
    try {
        const email = await Email.findOne({
            doc_id: req.params.id
        });

        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }

        email.email = req.body.email;
        email.role = req.body.role;
        email.save();

        return res.status(200).json(email);
    } catch (error) {
        console.error('Error retrieving score by ID:', error);
        return res.status(500).json({ message: 'Error fetching score by ID', error });
    }
})

// Create
router.post("/", async (req, res) => {
    console.log(`"POST /api/emails - Create"`)
    try {
        const { doc_id, average_score } = req.body;

        const newEmail = new Email({
            doc_id,
            average_score
        })

        await newEmail.save();
        return res.status(201).json(newEmail);
    } catch (error) {
        console.error('Error retrieving all score:', error);
        return res.status(500).json({ message: 'Error fetching score', error });
    }
})

// Get All
router.get("/", async (req, res) => {
    console.log(`"GET /api/emails - Get All"`);
    try {
        const emails = await Email.find({ doc_id: req.params.id });
        if (!emails || emails.length === 0) {
            return res.status(200).json({ doc_id: req.params.id, average_score: 0 });
        }
        return res.status(200).json({ doc_id: req.params.id, average_score: averageScore });
    } catch (error) {
        console.error('Error retrieving average score by ID:', error);
        return res.status(500).json({ message: 'Error fetching average score by ID', error });
    }
});

export default router;
