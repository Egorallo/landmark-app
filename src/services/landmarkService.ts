import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebaseInit';

interface Landmark {
  id?: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
  long: number;
  lat: number;
  images: string[];
}

export async function addNewLandmark(userId: string, newLandmark: Landmark) {
  const userDocRef = doc(db, 'users', userId);

  await setDoc(
    userDocRef,
    {
      lastAccessed: new Date().toISOString(),
    },
    { merge: true },
  );

  const userLandmarksRef = collection(userDocRef, 'landmarks');
  await addDoc(userLandmarksRef, {
    userId: newLandmark.userId,
    name: newLandmark.name,
    description: newLandmark.description,
    rating: newLandmark.rating,
    long: newLandmark.long,
    lat: newLandmark.lat,
    images: newLandmark.images,
  });
}

export async function removeLandmark(userId: string, landmarkId: string) {
  const landmarkDocRef = doc(db, `users/${userId}/landmarks`, landmarkId);
  await deleteDoc(landmarkDocRef);
}

export async function updLandmark(
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

export async function getAllLandmarks(): Promise<Landmark[]> {
  const usersCollectionRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollectionRef);

  const allLandmarks: Landmark[] = [];
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const landmarksRef = collection(db, 'users', userId, 'landmarks');
    const landmarksSnapshot = await getDocs(landmarksRef);
    const userLandmarks = landmarksSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          userId,
          ...doc.data(),
        }) as Landmark,
    );

    allLandmarks.push(...userLandmarks);
  }

  return allLandmarks;
}
