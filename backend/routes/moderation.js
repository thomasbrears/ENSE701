import express from 'express';
import ModeratorArticle from '../models/ModeratorArticle.js';

const router = express.Router();

// route to get moderation queue
router.get('/moderationQueue', async (req, res) => {
    try {
        //fetching articles which status = pending
        const articles = await ModeratorArticle.find({ status: 'pending' });
        //Json return
        res.json(articles);
    } catch (error) {
        //error handling and error output
        res.status(500).json({ message: 'Error fetching articles' });
    }
});

export default router;
