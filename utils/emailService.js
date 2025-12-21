import nodemailer from 'nodemailer';

// interface RegistrationEmailData {
//   name: string;
//   category: string;
//   registrationDate: string;
// }

export const sendRegistrationEmail = async (to, data) => {
  try {
    // Configure your email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: 'Service Registration Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Service Registration Confirmation</h2>
          <p>Hello ${data.name},</p>
          <p>Thank you for registering as a service provider on our platform!</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937;">Registration Details:</h3>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Registration Date:</strong> ${data.registrationDate}</p>
            <p><strong>Status:</strong> Under Review</p>
          </div>
          
          <p>Our team will review your application and get back to you within 2-3 business days.</p>
          
          <p style="color: #6b7280; font-size: 14px;">
            If you have any questions, please contact our support team at support@yourplatform.com
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${to}`);
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};