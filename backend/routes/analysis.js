import express from 'express';
import Article from '../models/Article.js';   // Import the Article model

const router = express.Router();

// GET /api/analyses/approved_by_moderator - Retrieve all articles approced by moderator
router.get('/articles', async (req, res) => {
  try {
    const approvedAnalyses = await Article.find({ status: 'approved_by_moderator' });
    res.status(200).json(approvedAnalyses);
  } catch (error) {
    console.error('Error retrieving approved analyses:', error);
    res.status(500).json({ message: 'Error fetching approved analyses', error });
  }
});

router.post('/articles/:id/evidence', async (req, res) => {
    const articleId = req.params.id;
    const { evidence } = req.body;

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.evidence = evidence;
        await article.save();
        res.status(200).json({message: 'Evidence succefully submitted', article});
    } catch (error) {
        console.error('Error saving the evidence:', error);
        res.status(500).json({ message: 'Error saving the evidence', error });
    }
});

router.post('/articles/:id/approve', async (req, res) => {
    const articleId = req.params.id;

    try {
        const article = await Article.findByIdAndUpdate(
            articleId,
            { status: 'published' },
            { new: true }
        );
        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json({message: 'Article approved and published', article});
    } catch (error) {
        console.error('Error approving the article:', error);
        res.status(500).json({ message: 'Error approving the article', error });
    }
});

router.post('/articles/:id/reject', async (req, res) => {
    const articleId = req.params.id;

    try {
        const article = await Article.findByIdAndUpdate(
            articleId,
            { status: 'rejected' },
            { new: true }
        );
        if (!article) return res.status(404).json({ message: 'Article not found' });

        res.status(200).json({message: 'Article rejected', article});
    } catch (error) {
        console.error('Error rejecting the article:', error);
        res.status(500).json({ message: 'Error rejecting the article', error });
    }
    });

    // GET /api/articles/:id - Retrieve a single article by ID
router.get('/:id', async (req, res) => {
    console.log(`"GET /api/articles/${req.params.id} - Retrieve a single article by ID"`)
    try {
      const article = await Article.findById(req.params.id);
      if (!article) return res.status(404).json({ message: 'Article not found' });
      res.status(200).json(article);
    } catch (error) {
      console.error('Error retrieving that article:', error);
      res.status(500).json({ message: 'Error fetching article', error });
    }
  });

    export default router;
