import { doc, deleteDoc, updateDoc, getDoc, getDocs, addDoc, collection } from 'firebase/firestore';
import { db } from './firebaseInit';

interface Landmark {
  id: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
}

export async function addNewLandmark(userId: string, newLandmark: Landmark) {
  const userLandmarksRef = collection(doc(db, 'users', userId), 'landmarks');
  await addDoc(userLandmarksRef, {
    userId: newLandmark.userId,
    name: newLandmark.name,
    description: newLandmark.description,
    rating: newLandmark.rating,
  });
}

export async function removeLandmark(userId: string, landmarkId: string) {
  const landmarkDocRef = doc(db, `users/${userId}/landmarks`, landmarkId);
  await deleteDoc(landmarkDocRef);
}

export async function updateLandmark(
  userId: string,
  landmarkId: string,
  updatedData: Partial<Landmark>,
) {
  const landmarkDocRef = doc(db, `users/${userId}/landmarks`, landmarkId);
  await updateDoc(landmarkDocRef, updatedData);
}

export async function getLandmarkById(userId: string, landmarkId: string) {
  const landmarkDocRef = doc(db, `users/${userId}/landmarks`, landmarkId);
  const landmarkDoc = await getDoc(landmarkDocRef);
  if (landmarkDoc.exists()) {
    return { id: landmarkDoc.id, ...landmarkDoc.data() };
  }
}

export async function getLandmarks(userId: string) {
  const userLandmarksRef = collection(doc(db, 'users', userId), 'landmarks');
  const landmarkSnapshot = await getDocs(userLandmarksRef);
  const landmarkList = landmarkSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return landmarkList as Landmark[];
}
