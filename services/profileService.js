// services/profileService.js

import { db, storage } from '../firebaseConfig';

export const fetchUserProfile = async (userId) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    return userDoc.data();
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

export const fetchUserBaskets = async (userId) => {
  try {
    const basketsSnapshot = await db.collection('baskets').where('userId', '==', userId).get();
    const baskets = basketsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return baskets;
  } catch (error) {
    throw new Error('Error fetching baskets: ' + error.message);
  }
};

export const updateUserProfilePicture = async (userId, imageUri) => {
  try {
    const response = await fetch(imageUri); 
    const blob = await response.blob(); 

    const storageRef = storage.ref(`profilePictures/${userId}`); 
    await storageRef.put(blob); 

    const downloadURL = await storageRef.getDownloadURL(); 

    const userDoc = db.collection('users').doc(userId); 
    await userDoc.update({ avatar: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error('Error in updateUserProfilePicture:', error);
    throw new Error('Erreur lors de la mise à jour de la photo de profil: ' + error.message);
  }
};

// Nouvelle fonction pour réserver un panier
export const reservePanier = async (panierId, beneficiaryId) => {
  try {
    // Mettre à jour le panier pour indiquer qu'il a été réservé
    await db.collection('paniers').doc(panierId).update({
      available: false,
      reservedBy: beneficiaryId
    });
    
    // Ajouter la réservation au bénéficiaire
    const beneficiaryRef = db.collection('users').doc(beneficiaryId);
    await beneficiaryRef.update({
      reservedPaniers: firebase.firestore.FieldValue.arrayUnion(panierId)
    });
  } catch (error) {
    console.error('Erreur lors de la réservation du panier:', error);
    throw new Error('Erreur lors de la réservation du panier: ' + error.message);
  }
};
