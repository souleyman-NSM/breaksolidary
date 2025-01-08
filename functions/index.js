// functions/index.js

const admin = require('firebase-admin');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Assurez-vous d'avoir un fichier .env pour stocker les variables sensibles

// Initialiser Firebase Admin SDK
admin.initializeApp();

// Créez l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(bodyParser.json());

// Configuration de Nodemailer pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Vous pouvez utiliser un autre service, selon vos besoins
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction utilitaire pour envoyer un email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error; // Relance l'erreur pour une gestion correcte
  }
};

// Fonction pour attribuer un rôle d'administrateur à un utilisateur Firebase
const setAdminRole = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin role assigned to user: ${uid}`);
  } catch (error) {
    console.error(`Error setting admin role for user ${uid}:`, error);
    throw error; // Relance l'erreur pour une gestion correcte
  }
};

// Route pour créer une demande de vérification d'utilisateur
app.post('/requestVerification', async (req, res) => {
  const { userId, email, name } = req.body;

  if (!userId || !email || !name) {
    return res.status(400).send('Invalid request: userId, email, and name are required.');
  }

  try {
    const db = admin.firestore();

    // Ajouter la demande de vérification dans Firestore
    await db.collection('verification_requests').doc(userId).set({
      userId,
      email,
      name,
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending', // La demande est en attente de validation
    });

    // Envoyer une notification par email à l'administrateur
    await sendEmail(
      'souley.yacef@gmail.com', // Adresse email de l'administrateur
      'Nouvelle demande de vérification utilisateur',
      `
      Bonjour,

      Une nouvelle demande de vérification utilisateur a été reçue.
      Veuillez ouvrir l'application pour valider ou refuser cette demande.

      Détails de l'utilisateur :
      - Nom : ${name}
      - Email : ${email}
      - ID Utilisateur : ${userId}

      Merci,
      Votre équipe.
      `
    );

    res.status(200).send('Demande de vérification envoyée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la demande de vérification :', error);
    res.status(500).send('Une erreur est survenue lors de la demande de vérification.');
  }
});

// Route pour envoyer un code de vérification à l'utilisateur
app.post('/sendVerificationCode', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).send('Invalid request: email and code are required.');
  }

  try {
    await sendEmail(
      email,
      'Code de Vérification',
      `Votre code de vérification est : ${code}`
    );
    res.status(200).send('Code envoyé avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du code de vérification :', error);
    res.status(500).send('Une erreur est survenue lors de l\'envoi du code.');
  }
});

// Route pour attribuer un rôle administrateur à un utilisateur
app.post('/setAdminRole', async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).send('Invalid request: uid is required.');
  }

  try {
    await setAdminRole(uid);
    res.status(200).send(`Admin role successfully assigned to user ${uid}`);
  } catch (error) {
    console.error('Erreur lors de l\'attribution du rôle administrateur :', error);
    res.status(500).send(`Erreur lors de l'attribution du rôle administrateur : ${error.message}`);
  }
});

// Route pour créer un compte utilisateur et envoyer un email de confirmation
app.post('/createDonor', async (req, res) => {
  const { userId, email, name } = req.body;

  if (!userId || !email || !name) {
    return res.status(400).send('Invalid request: userId, email, and name are required.');
  }

  try {
    const db = admin.firestore();

    // Enregistrer la demande dans Firestore
    await db.collection('verification_requests').doc(userId).set({
      userId,
      email,
      name,
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending', // Demande en attente
    });

    // Générer un code de vérification
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // Code de 6 chiffres

    // Envoyer un email de confirmation
    await sendEmail(
      email,
      'Votre vérification de compte',
      `Bonjour ${name},\n\nVotre code de vérification est : ${verificationCode}\n\nMerci de votre inscription !`
    );

    res.status(200).send('Compte utilisateur créé et email envoyé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création du compte utilisateur :', error);
    res.status(500).send('Une erreur est survenue lors de la création du compte utilisateur.');
  }
});

// Lancer le serveur Express
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});