// services/sendEmail.js

import nodemailer from 'nodemailer';

export const sendEmail = async (subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com', // Remplacez par votre e-mail
      pass: 'your-email-password', // Remplacez par votre mot de passe ou un mot de passe d'application
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'souley.yacef@gmail.com',
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification e-mail envoyée');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
  }
};