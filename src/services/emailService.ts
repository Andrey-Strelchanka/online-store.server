import nodemailer from 'nodemailer';

export const sendActivationMail = async (
  to: string,
  link: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject: 'Activate your account (online-store)',
    text:
      'Follow the link to activate your account: ' +
      link,
  };
  await transporter.sendMail(mailOptions);
};
