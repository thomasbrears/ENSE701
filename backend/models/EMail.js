import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: Number, required: true },
    create_time: { type: Date, default: Date.now },
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
