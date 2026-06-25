const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendReviewNotification = async (studentEmail, subject, status) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: `Lab Manual Reviewed: ${subject}`,
      text: `Your lab manual for ${subject} has been ${status.toLowerCase()}. Please log in to the portal to see faculty comments and the AI report.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0ea5e9;">Sage University Lab Portal</h2>
          <p>Hello,</p>
          <p>Your lab manual for <strong>${subject}</strong> has been <strong>${status}</strong>.</p>
          <p>Please log in to the portal to see faculty comments and the AI quality report.</p>
          <br>
          <a href="#" style="background: #0ea5e9; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">View Submission</a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending failed:', err);
  }
};
