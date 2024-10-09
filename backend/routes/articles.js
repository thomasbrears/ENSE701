import express from 'express';
import Article from '../models/Article.js';
import Role from '../models/Roles.js';
import { sendEmail } from '../utils/mailjet.js';
import moment from 'moment'; // To format dates

const router = express.Router();

// GET /api/articles/published - Retrieve all published articles
router.get('/published', async (req, res) => {
  try {
    const publishedArticles = await Article.find({ status: 'published' });
    res.status(200).json(publishedArticles);
  } catch (error) {
    console.error('Error retrieving published articles:', error);
    res.status(500).json({ message: 'Error fetching published articles', error });
  }
});

router.get('/rejected', async (req, res) => {
  try {
    const rejectedArticles = await Article.find({ status: 'rejected' });
    res.status(200).json(rejectedArticles);
  } catch (error) {
    console.error('Error retrieving rejected articles:', error);
    res.status(500).json({ message: 'Error fetching rejected articles', error });
  }
});

// POST /api/articles - Create a new article
router.post('/', async (req, res) => {
  console.log("POST /api/articles - Create a new article")
  try {
    const { title, authors, source, journal, se_practice, research_type, publication_year,
      volume, number, pages, doi, summary, claim, linked_discussion, user_name, user_email } = req.body;

    const newArticle = new Article({
      title,
      authors,
      source,
      journal,
      se_practice,
      research_type,
      publication_year,
      volume,
      number,
      pages,
      doi,
      summary,
      claim,
      linked_discussion,
      user_name,
      user_email,
      status: 'pending', // Default status to pending
    });

    const savedArticle = await newArticle.save(); // Save and store the result in savedArticle

    const submissionDate = moment(savedArticle.submitted_at).format('MMMM Do YYYY, h:mm:ss a'); // Format the date for the email

    // Fetch moderator(s) from the database to send the email to
    const moderators = await Role.find({ role: 'moderator' });

    // Send email to the submitter
    await sendEmail(
      user_email, // Who the email is sent to - submitter
      `Submission Received: ${title}`, // email subject then body (in HTML format)
      `
      <p>Kia ora ${user_name},</p>
      <p>Thank you for submitting your article titled "<strong>${title}</strong>".</p>
      <p>This email is to comfirm that your article submission has been received and is now in the queue for a moderator and analyst to review.<br/> We will contact you again soon once this process is complete</p>
      <p><br/><strong>Article Name</strong>: ${title}<br/>
      <strong>Date of Submission</strong>: ${submissionDate}<br/>
      <strong>Submission ID</strong>: ${savedArticle._id}</p>
      <p>You can track the status of your submission using this link:<br/>
      <a href="https://cise-aut.vercel.app/articles/lookup-submission?id=${savedArticle._id}">
      Check Submission Status</a></p>
      <p></p>
      <p>Best regards,<br/>The Software Practice Empirical Evidence Database Team</p>
      `
    );

    // Send email to all moderators
    moderators.forEach(async (mod) => {
      await sendEmail(
        mod.email, // Who the email is sent to - moderator(s)
        `New Article submited for Moderation: ${title} | SPEED`, // moderator email subject then body (in HTML format)
        `
        <p>Kia ora Moderator,</p>
        <p>A new article titled "<strong>${title}</strong>" has been submitted to SPEED by ${user_name} and requires moderation.</p>
        <p><strong>Article Name</strong>: ${title}<br/>
        <strong>Date of Submission</strong>: ${submissionDate}</p>
        <p>Submission ID: ${savedArticle._id}<br/>
        <p>Please moderate the article by following this link:<br/>
        <a href="https://cise-aut.vercel.app/moderator/${savedArticle._id}">
        Moderate Article</a></p>
        <p>Best regards,<br/>The Software Practice Empirical Evidence Database Team</p>
        `
      );
    });

    // Return the submission ID along with the success message
    res.status(201).json({ message: 'Article submitted successfully!', submissionId: savedArticle._id });
  } catch (error) {
    console.error('Error saving the article:', error);
    res.status(500).json({ message: 'Error saving the article', error });
  }
});


// GET /api/articles/track - Retrieve article(s) by email or submission ID
router.get('/track', async (req, res) => {
  const { email, submissionId } = req.query;

  try {
    // Search by email if provided
    if (email) {
      const articles = await Article.find({ user_email: email });
      if (!articles || articles.length === 0) {
        return res.status(404).json({ message: 'No submissions found for this email' });
      }
      return res.status(200).json(articles);
    }

    // Search by submission ID if provided
    if (submissionId) {
      const article = await Article.findById(submissionId);
      if (!article) {
        return res.status(404).json({ message: 'Submission not found with that ID' });
      }
      return res.status(200).json([article]);  // Return as an array for consistency
    }

    return res.status(400).json({ message: 'Either email or submission ID is required' });
  } catch (error) {
    console.error('Error fetching article:', error.stack);
    res.status(500).json({ message: 'Error fetching article', error: error.stack });
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
