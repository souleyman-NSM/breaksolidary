// services/userObserver.js

import { db } from './firebaseConfig';
import { sendEmail } from './sendEmail';

export const observeNewUsers = () => {
  db.collection('users')
    .where('verified', '==', false) // Filtrer uniquement les utilisateurs non validés
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newUser = change.doc.data();
          const subject = 'Nouvelle demande de validation utilisateur';
          const text = `Un nouvel utilisateur a été enregistré avec l'email : ${newUser.email}. 
          
Lancez l'application pour valider ou refuser cet utilisateur.`;

          // Envoi de l'e-mail de notification
          sendEmail(subject, text);
        }
      });
    });
};
