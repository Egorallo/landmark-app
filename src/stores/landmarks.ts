import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getLandmarks, addNewLandmark, removeLandmark } from '../services/landmarkService';
import { useUserStore } from './user';

interface Landmark {
  id: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
}

export const useLandmarksStore = defineStore('landmarks', () => {
  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);

  const landmarks = ref<Landmark[]>([]);

  async function fetchLandmarks() {
    if (!userId.value) {
      return;
    }
    const fetchedLandmarks = await getLandmarks(userId.value);
    landmarks.value = fetchedLandmarks;
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
      const fetchedLandmarks = await getLandmarks(userId.value);
      landmarks.value = fetchedLandmarks;
    }
  }

  function updateLandmark(landmarkId: string, updatedData: Partial<Landmark>) {
    if (!userId.value) {
      return;
    }
    landmarks.value = landmarks.value.map((landmark) =>
      landmark.id === landmarkId ? { ...landmark, ...updatedData } : landmark,
    );
  }

  const landmarksByUserId = computed(() =>
    landmarks.value.filter((landmark) => landmark.userId === userId.value),
  );

  return {
    landmarks,
    fetchLandmarks,
    addLandmark,
    deleteLandmark,
    updateLandmark,
    landmarksByUserId,
  };
});
