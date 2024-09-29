import express from 'express';
import Article from '../models/Article.js';
import Moderator from '../models/Moderator.js';

const router = express.Router();

// POST /api/articles - Create a new article
router.post('/', async (req, res) => {
  console.log("POST /api/articles - Create a new article")
  try {
    const { title, authors, source, publication_year, doi, summary, linked_discussion } = req.body;

    // 检查标题和DOI是佛重复
    const articles = Article.find({
      $or: [
        { title },
        { doi }
      ]
    })

    let is_repeat = false;
    if (articles && articles.length != 0) {
      is_repeat = true;
    }

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

    const newModerator = new Moderator({
      doc_id: newArticle._id,
      audit_status: false,
      audit_result: false,
      is_repeat
    })

    await newModerator.save();

    res.status(201).json({ article: newArticle, moderator: newModerator });
  } catch (error) {
    console.error('Error saving the article:', error);
    res.status(500).json({ message: 'Error saving the article', error });
  }
});

// GET /api/articles - Retrieve all articles
router.get('/', async (req, res) => {
  console.log("GET /api/articles - Retrieve all articles")
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error retrieving all articles:', error);
    res.status(500).json({ message: 'Error fetching articles', error });
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
