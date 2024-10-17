import express from 'express';
import Article from '../models/Article.js';

const router = express.Router();

// Retrieve all articles
router.get('/articles', async (req, res) => {
  try {
    const allArticles = await Article.find();
    res.status(200).json(allArticles);
  } catch (error) {
    console.error('Error retrieving articles:', error);
    res.status(500).json({ message: 'Error fetching articles', error });
  }
});

router.delete('/articles/:id', async (req, res) => {
  console.log(`"DELETE /api/articles/${req.params.id} - Delete an article by ID"`)
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.status(200).json({ message: 'Article deleted successfully!' });
  } catch (error) {
    console.error('Error deleting the article:', error);
    res.status(500).json({ message: 'Error deleting the article', error });
  }
});

router.post('/articles/:id/status', async (req, res) => {
    const articleId = req.params.id;
    const { status } = req.body;

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.status = status;
        await article.save();
        res.status(200).json({ message: 'Status successfully updated', article });
    } catch (error) {
        console.error('Error updating the status:', error);
        res.status(500).json({ message: 'Error updating the status', error });
    }
});

router.post('/articles/:id/analysis_notes', async (req, res) => {
    const articleId = req.params.id;
    const { analysis_notes } = req.body;

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.analysis_notes = analysis_notes;
        await article.save();
        res.status(200).json({message: 'Analysis notes successfully submitted', article});
    } catch (error) {
        console.error('Error saving the analysis notes:', error);
        res.status(500).json({ message: 'Error saving the analysis notes', error });
    }
});

router.post('/articles/:id/claim', async (req, res) => {
    const articleId = req.params.id;
    const { claim } = req.body;

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.claim = claim;
        await article.save();
        res.status(200).json({message: 'Claim successfully submitted', article});
    } catch (error) {
        console.error('Error saving the claim:', error);
        res.status(500).json({ message: 'Error saving the claim', error });
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
        res.status(200).json({message: 'Evidence successfully submitted', article});
    } catch (error) {
        console.error('Error saving the evidence:', error);
        res.status(500).json({ message: 'Error saving the evidence', error });
    }
});

router.post('/articles/:id/evidence_summary', async (req, res) => {
    const articleId = req.params.id;
    const { evidence_summary } = req.body;

    try {
      const article = await Article.findById(articleId);
      if (!article) return res.status(404).json({ message: 'Article not found' });

      article.evidence_summary = evidence_summary;
      await article.save();
      res.status(200).json({ message: 'Evidence summary successfully submitted', article });
    } catch (error) {
      console.error('Error saving the evidence summary:', error);
      res.status(500).json({ message: 'Error saving the evidence summary', error });
    }
  });

export default router;
