import mongoose from 'mongoose';

const moderatorSchema = new mongoose.Schema({
    doc_id: { require: true, type: String },
    audit_status: { require: true, type: Boolean },
    audit_result: { require: false, type: Boolean },
    is_repeat: { require: true, type: Boolean }
});

const Moderator = mongoose.model('Moderator', moderatorSchema);

export default Moderator;
