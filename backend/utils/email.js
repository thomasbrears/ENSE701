import nodemailer from 'nodemailer';

// Configure the Nodemailer transporter.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD 
    }
});

const sendEmail = async (to, subject, text) => {

    const mailOptions = {
        from: process.env.EMAIL,    // addresser
        to,                           // consignee
        subject,                      // theme
        text                          // content
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        return false;
    }
}

export default {
    sendEmail
};
