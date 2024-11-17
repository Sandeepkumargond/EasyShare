import nodemailer from "nodemailer";

// Set up the email transporter using your email service (SMTP or other)
const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your email provider or SMTP settings
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export async function sendReplyEmail(userEmail, userName) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // sender address
      to: userEmail, // recipient's email address
      subject: "Thank you for your inquiry!", // subject of the email
      text: `Hello ${userName},\n\nThank you for reaching out! We have received your message and will get back to you shortly.\n\nBest regards,\nYour Company Name`, // plain text body
      html: `<p>Hello ${userName},</p><p>Thank you for reaching out! We have received your message and will get back to you shortly.</p><p>Best regards,<br>Your Company Name</p>`, // HTML body
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
