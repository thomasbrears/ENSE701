import mongoose from 'mongoose';


const ModeratorArticleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authors: { type: [String], required: true }, 
    submissionDate: { type: Date, required: true },

    status: { 
        type: String, 
        enum: ['pending', 'approved_by_moderator', 'published'], 
        default: 'pending' //default!
    },
}, { collection: 'articles' }); 

// creating moderator article model
const ModeratorArticle = mongoose.model('ModeratorArticle', ModeratorArticleSchema);


export default ModeratorArticle;
