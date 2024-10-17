import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: [String] },
  journal: { type: String },
  se_practice: { type: String },
  research_type: { type: String },
  publication_year: { type: Number },
  volume: { type: String },
  number: { type: String },
  pages: { type: String },
  doi: { type: String },
  summary: { type: String },
  claim: { type: String },
  evidence: { type: String, default: null }, // Analyst will add the evidence later
  evidence_summary: { type: String, enum: ['weak', 'moderate', 'strong'], default: null }, // Analyst will add the evidence summary later
  linked_discussion: { type: String },
  status: { type: String, enum: ['pending', 'approved_by_moderator', 'published', 'rejected'], default: 'pending' },
  moderation_notes: { type: String },
  analysis_notes: { type: String, default: null }, // Analysis will add the analysis notes later
  submitted_at: { type: Date, default: Date.now }, // Timestamp of submission
  moderated_at: { type: Date, default: Date.now },  // Timestamp when moderated
  analyzed_at: { type: Date, default: Date.now },  // Timestamp when analyzed
  repeat_flag: { type: Boolean, default: false },
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
