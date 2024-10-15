import express from 'express';
import Article from '../models/Article.js'; // Article model
import Role from '../models/Roles.js'; // Role model
import { sendEmail } from '../utils/mailjet.js'; // Send email utility
import moment from 'moment'; // To format dates

const router = express.Router();

// GET /api/analyses/approved_by_moderator - Retrieve all articles approced by moderator
router.get('/articles', async (req, res) => {
  try {
    const moderationQueue = await Article.find({ status: 'pending' });
    res.status(200).json(moderationQueue);
  } catch (error) {
    console.error('Error retrieving approved analyses:', error);
    res.status(500).json({ message: 'Error fetching approved analyses', error });
  }
});

router.post('/articles/:id/approve', async (req, res) => {
    const articleId = req.params.id;

    try {
        const article = await Article.findByIdAndUpdate(
            articleId,
            { status: 'approved_by_moderator' },
            { new: true }
        );
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const submissionDate = moment(article.submitted_at).format('MMMM Do YYYY, h:mm:ss a'); // Format the date for the email

        // Fetch analyst(s) from the database to send the email to
        const analysts = await Role.find({ role: 'analyst' });

        // Send email to the analyst(s) with the article details
        analysts.forEach(async (analyst) => {
            await sendEmail(
                analyst.email,  // Who the email is sent to - analst(s)
                `New Article Approved for Analysis: ${article.title}`, // moderator email subject then body (in HTML format)
                `
                <p>Kia ora Analyst,</p>
                <p>An article titled "<strong>${article.title}</strong>" has been approved by a moderator and is ready for analysis.</p>
                <p><strong>Article Name</strong>: ${article.title}<br/>
                <strong>Submitted on</strong>: ${submissionDate}</p>
                <p>Please review the article on this link: <a href="https://cise-aut.vercel.app/analyst/${article._id}">Review Article</a></p>
                <p>Best regards,<br/>The Software Practice Empirical Evidence Database Team</p>
                `
            );
        });

        res.status(200).json({message: 'Article approved and sent to Analyst', article});
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
