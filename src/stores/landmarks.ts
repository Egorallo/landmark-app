import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
  getAllLandmarks,
  addNewLandmark,
  removeLandmark,
  updLandmark,
  updLandmarkRating,
} from '../services/landmarkService';
import { useUserStore } from './user';
import { evaluateScore } from '@/utils/scoreEvaluator';

export const useLandmarksStore = defineStore('landmarks', () => {
  const userStore = useUserStore();
  const userId = computed(() => userStore.userId);

  const landmarks = ref<Landmark[]>([]);

  async function fetchLandmarks() {
    if (!userId.value) {
      return;
    }
    const fetchedLandmarks = await getAllLandmarks();
    landmarks.value = fetchedLandmarks.sort(
      (a, b) => evaluateScore(b.rating, b.visitors) - evaluateScore(a.rating, a.visitors),
    );
  }

  function getLandmarkById(landmarkId: string) {
    return landmarks.value.find((landmark) => landmark.id === landmarkId);
  }

  async function addLandmark(newLandmark: Landmark) {
    if (!userId.value) {
      return;
    }

    await addNewLandmark(userId.value, newLandmark);

    landmarks.value = [...landmarks.value, newLandmark];
  }

  async function deleteLandmark(delLamdmarkUserId: string, landmarkId: string) {
    landmarks.value = landmarks.value.filter((landmark) => landmark.id !== landmarkId);

    try {
      await removeLandmark(delLamdmarkUserId, landmarkId);
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
    await updLandmark(updatedData.userId!, landmarkId, updatedData);
  }

  async function updateLandmarkRating(landmarkId: string, landmarkUserId: string, rating: number) {
    const landmark = landmarks.value.find((landmark) => landmark.id === landmarkId);
    if (!landmark || !userId.value) {
      return;
    }
    const res = await updLandmarkRating(userId.value, landmarkUserId, landmarkId, rating, landmark);
    return res;
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
    getLandmarkById,
    addLandmark,
    deleteLandmark,
    updateLandmark,
    updateLandmarkRating,
    landmarksByUserId,
  };
});
