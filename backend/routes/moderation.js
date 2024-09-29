import express from 'express';
import Article from '../models/Article.js';
import Moderator from '../models/Moderator.js';

const router = express.Router();

router.get("/", async (req, res) => {
    console.log("GET /api/moderation - GET Moderation List")

    const moderators = await Moderator.find({
        audit_result: false,
        audit_status: false
    });

    if (!moderators || moderators.length === 0) {
        return res.status(404).json({ message: 'No moderators found' });
    }

    const articles = await Promise.all(
        moderators.map(async (mod) => {
            const article = await Article.findById(mod.doc_id);
            return article;
        })
    );

    console.log(articles);

    return res.status(201).json(articles);
});

router.post("/pass/:id", async (req, res) => {
    console.log("POST /api/moderation/pass - POST Moderation Pass")

    const moderator = await Moderator.findOne({
        doc_id: req.params.id
    });

    if (moderator) {
        moderator.audit_result = true;
        moderator.audit_status = true;

        await moderator.save();
    } else {
        return res.status(400).json({ message: "inexistent" });
    }

    return res.status(201).json(moderator);
})

router.post("/reject/:id", async (req, res) => {
    console.log("POST /api/moderation/reject - POST Moderation Reject")

    const moderator = await Moderator.findOne({
        doc_id: req.params.id
    });

    if (moderator) {
        moderator.audit_result = false;
        moderator.audit_status = true;

        await moderator.save();
    } else {
        return res.status(400).json({ message: "inexistent" });
    }

    return res.status(201).json(moderator);
})


// POST /api/articles - Create a new article
router.post('/', async (req, res) => {
    console.log("POST /api/articles - Create a new article")
    try {
        const { title, authors, source, publication_year, doi, summary, linked_discussion } = req.body;

        const newArticle = new Article({
            title,
            authors,
            source,
            publication_year,
            doi,
            summary,
            linked_discussion,
            status: 'pending', // Default status to pending
        });

        await newArticle.save();
        res.status(201).json(newArticle);
    } catch (error) {
        console.error('Error saving the article:', error);
        res.status(500).json({ message: 'Error saving the article', error });
    }
});

export default router;
