import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

export async function sendReplyEmail(userEmail, userName) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, 
      to: userEmail, 
      subject: "Thank you for your inquiry!", 
      text: `Hello ${userName},\n\nThank you for reaching out! We have received your message and will get back to you shortly.\n\nBest regards,\nYour Company Name`, // plain text body
      html: `<p>Hello ${userName},</p><p>Thank you for reaching out! We have received your message and will get back to you shortly.</p><p>Best regards,<br>Your Company Name</p>`, // HTML body
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
