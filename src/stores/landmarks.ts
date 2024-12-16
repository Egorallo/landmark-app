import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  getAllLandmarks,
  addNewLandmark,
  removeLandmark,
  updLandmark,
} from '../services/landmarkService';
import { useUserStore } from './user';

export const useLandmarksStore = defineStore('landmarks', () => {
  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);

  const landmarks = ref<Landmark[]>([]);

  async function fetchLandmarks() {
    if (!userId.value) {
      return;
    }
    const fetchedLandmarks = await getAllLandmarks();
    landmarks.value = fetchedLandmarks.sort((a, b) => b.rating - a.rating);
  }

  async function addLandmark(newLandmark: Landmark) {
    if (!userId.value) {
      return;
    }

    await addNewLandmark(userId.value, newLandmark);

    landmarks.value = [...landmarks.value, newLandmark];
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
