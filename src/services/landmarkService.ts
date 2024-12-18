import {
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  setDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebaseInit';

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

  const docRef = await addDoc(userLandmarksRef, {
    userId: newLandmark.userId,
    name: newLandmark.name,
    description: newLandmark.description,
    rating: newLandmark.rating,
    totalRating: newLandmark.totalRating,
    visitors: newLandmark.visitors,
    long: newLandmark.long,
    lat: newLandmark.lat,
    images: newLandmark.images,
  });

  const landmarkId = docRef.id;

  const userLandmarksRatedRef = collection(userDocRef, 'landmarksRated');

  await addDoc(userLandmarksRatedRef, {
    landmarkId,
  });
}

export async function removeLandmark(userId: string, landmarkId: string) {
  const landmarkDocRef = doc(db, `users/${userId}/landmarks`, landmarkId);

  await deleteDoc(landmarkDocRef);

  const usersCollectionRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollectionRef);

  const deletePromises: Promise<void>[] = [];
  usersSnapshot.forEach(async (userDoc) => {
    const userLandmarksRatedRef = collection(userDoc.ref, 'landmarksRated');
    const landmarksRatedSnapshot = await getDocs(userLandmarksRatedRef);

    landmarksRatedSnapshot.forEach((landmarkRatedDoc) => {
      if (landmarkRatedDoc.data().landmarkId === landmarkId) {
        deletePromises.push(deleteDoc(landmarkRatedDoc.ref));
      }
    });
  });

  await Promise.all(deletePromises);
}

export async function updLandmark(
  userId: string,
  landmarkId: string,
  updatedData: Partial<Landmark>,
) {
  console.log('nigge ', landmarkId);
  const landmarkDocRef = doc(db, `users/${userId}/landmarks/${landmarkId}`);
  await updateDoc(landmarkDocRef, updatedData);
}

export async function updLandmarkRating(
  userId: string,
  landmarkUserId: string,
  landmarkId: string,
  updatedData: Partial<Landmark>,
) {
  console.log(landmarkId);
  const landmarksRatedRef = collection(db, `users/${userId}/landmarksRated`);

  const q = query(landmarksRatedRef, where('landmarkId', '==', landmarkId));
  const querySnapshot = await getDocs(q);
  console.log(querySnapshot.empty);

  if (!querySnapshot.empty) {
    console.log('HAHAHAHAHAHAHA');
    return false;
  }

  await updLandmark(landmarkUserId, landmarkId, updatedData);

  await addDoc(landmarksRatedRef, { landmarkId });

  return true;
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
