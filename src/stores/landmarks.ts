import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  getAllLandmarks,
  addNewLandmark,
  removeLandmark,
  updLandmark,
} from '../services/landmarkService';
import { useUserStore } from './user';

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

export const useLandmarksStore = defineStore('landmarks', () => {
  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);

  const landmarks = ref<Landmark[]>([]);

  async function fetchLandmarks() {
    if (!userId.value) {
      return;
    }
    const fetchedLandmarks = await getAllLandmarks();
    console.log('fetched from store: ', fetchedLandmarks);
    landmarks.value = fetchedLandmarks.sort((a, b) => b.rating - a.rating);
  }

  async function addLandmark(newLandmark: Landmark) {
    if (!userId.value) {
      return;
    }
    await addNewLandmark(userId.value, newLandmark);
    landmarks.value.push(newLandmark);
  }

  async function deleteLandmark(landmarkId: string) {
    if (!userId.value) {
      return;
    }
    landmarks.value = landmarks.value.filter((landmark) => landmark.id !== landmarkId);

    try {
      await removeLandmark(userId.value, landmarkId);
    } catch (_) {
      const fetchedLandmarks = await getAllLandmarks();
      landmarks.value = fetchedLandmarks;
    }
  }

  async function updateLandmark(landmarkId: string, updatedData: Partial<Landmark>) {
    if (!userId.value) {
      return;
    }
    landmarks.value = landmarks.value.map((landmark) =>
      landmark.id === landmarkId ? { ...landmark, ...updatedData } : landmark,
    );
    await updLandmark(userId.value, landmarkId, updatedData);
  }

  if (userStore.userId) {
    fetchLandmarks();
  }

  const landmarksByUserId = computed(() =>
    landmarks.value.filter((landmark) => landmark.userId === userId.value),
  );

  watch(userId, async (newUserId) => {
    console.log('mmmmm');
    if (newUserId) {
      await fetchLandmarks();
    }
  });

  return {
    landmarks,
    fetchLandmarks,
    addLandmark,
    deleteLandmark,
    updateLandmark,
    landmarksByUserId,
  };
});
