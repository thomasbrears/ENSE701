import express from 'express';
import Article from '../models/Article.js'; // Article model
import { sendEmail } from '../utils/mailjet.js'; // Send email utility
import moment from 'moment'; // To format dates

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

router.post('/articles/:id/analysis_notes', async (req, res) => {
    const articleId = req.params.id;
    const { analysis_notes } = req.body;

    try {
        const article = await Article.findById(articleId);
        if (!article) return res.status(404).json({ message: 'Article not found' });

        article.analysis_notes = analysis_notes;
        await article.save();
        res.status(200).json({message: 'Analysis notes succefully submitted', article});
    } catch (error) {
        console.error('Error saving the analysis notes:', error);
        res.status(500).json({ message: 'Error saving the analysis notes', error });
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

// POST /api/articles/:id/evidence_summary - Update evidence summary for an article
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


router.post('/articles/:id/approve', async (req, res) => {
  const articleId = req.params.id;
  const { evidence, analysis_notes, evidence_summary } = req.body;

  if (!evidence_summary) {
    return res.status(400).json({ message: 'Evidence Summary is required before approving the article.' });
  }

  try {
    const updateFields = {
      status: 'published',
      evidence: evidence,
      analysis_notes: analysis_notes,
      evidence_summary: evidence_summary,
    };

    const article = await Article.findByIdAndUpdate(articleId, updateFields, { new: true });

    if (!article) return res.status(404).json({ message: 'Article not found' });

    const publicationDate = moment(article.submitted_at).format('MMMM Do YYYY, h:mm:ss a'); // Format the date for the email

    // Send email to the original submitter
    await sendEmail(
      article.user_email, // Who the email is sent to
      `Your Article Has Been Published: ${article.title}`, // email subject then body (in HTML format)
      `
      <p>Kia ora ${article.user_name},</p>
      <p>Good News! Your article titled "<strong>${article.title}</strong>" has been published on the SPEED website.</p>
      <p><strong>Published on</strong>: ${publicationDate}<br/>
      <strong>Submission ID</strong>: ${article._id}</p>
      <p>You can view your article by on this link: <a href="https://cise-aut.vercel.app/articles/${article._id}">View Published Article</a></p>
      <p>Thank you for your contribution to the SPEED database.</p>
      <p>Best regards,<br/>The Software Practice Empirical Evidence Database Team</p>
      `
    );

    res.status(200).json({ message: 'Article approved and published', article });
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

        const rejectionDate = moment().format('MMMM Do YYYY, h:mm:ss a'); // Format the date for the email

        // Send email to the original submitter
        await sendEmail(
          article.user_email,
          `Sorry, your article has been REJECTED: ${article.title}`,
          `
          <p>Kia ora ${article.user_name},</p>
          <p>We regret to inform you that your article titled "<strong>${article.title}</strong>" has been rejected for SPEED on ${rejectionDate}.</p>
          <p>Thank you for your submission to the SPEED database, and we encourage you to review your submission and make any necessary adjustments before resubmitting.</p>
          <p>Best regards,<br/>The Software Practice Empirical Evidence Database Team</p>
          `
        );
      
        res.status(200).json({message: 'Article rejected', article});
    } catch (error) {
        console.error('Error rejecting the article:', error);
        res.status(500).json({ message: 'Error rejecting the article', error });
    }
    });

    export default router;
