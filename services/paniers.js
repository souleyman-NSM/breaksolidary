// services/paniers.js

import { db } from '../firebaseConfig';

export const getPaniers = async () => {
  try {
    const snapshot = await db.collection('paniers').get();
    if (snapshot.empty) {
      return [];
    }
    const paniers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return paniers;
  } catch (error) {
    console.error('Erreur lors de la récupération des paniers:', error);
    throw error;
  }
};

// Nouvelle fonction pour mettre à jour la disponibilité d'un panier
export const updatePanierAvailability = async (panierId, isAvailable) => {
  try {
    const panierRef = db.collection('paniers').doc(panierId);
    await panierRef.update({ available: isAvailable });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la disponibilité du panier:', error);
    throw error;
  }
};
