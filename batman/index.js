// batman/index.js

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
  service: 'gmail', // ou un autre service de votre choix
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour définir un rôle d'admin
const setAdminRole = async (uid) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin role assigned to user: ${uid}`);
  } catch (error) {
    console.error(`Error setting admin role for user ${uid}:`, error);
  }
};

// Fonction pour envoyer un code de vérification par email
app.post('/sendVerificationCode', async (req, res) => {
  const { email, code } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // L'adresse email de l'expéditeur
    to: email, // L'email du destinataire
    subject: 'Code de Vérification',
    text: `Votre code de vérification est : ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Code envoyé avec succès');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// Fonction HTTP pour attribuer un rôle administrateur (définissez l'UID de l'utilisateur à promouvoir)
app.post('/setAdminRole', async (req, res) => {
  const { uid } = req.body; // UID de l'utilisateur à promouvoir

  try {
    await setAdminRole(uid);
    res.status(200).send(`Admin role successfully assigned to user ${uid}`);
  } catch (error) {
    res.status(500).send(`Error assigning admin role: ${error.message}`);
  }
});

// Lancer le serveur Express
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

