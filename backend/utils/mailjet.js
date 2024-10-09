import mailjet from 'node-mailjet';
import dotenv from 'dotenv';

dotenv.config(); // To load Mailjet credentials from .env file

// Use `apiConnect` instead of `connect`
const mailjetClient = mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

// Send email function
export const sendEmail = async (toEmail, subject, text) => {
  try {
    const request = mailjetClient.post("send", { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "speed@pricehound.tech",
            Name: "SPEED",
          },
          To: [
            {
              Email: toEmail,
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: `<p>${text}</p>`,
        },
      ],
    });
    const result = await request;
    console.log('Email sent successfully:', result.body);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
