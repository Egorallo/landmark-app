import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Landmark {
  id: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
  photos: string[];
}

export const useLandmarksStore = defineStore('landmarks', () => {
  const landmarks = ref<Landmark[]>([]);
  const userId = ref<string | null>(null);

  function setLandmarks(newLandmarks: Landmark[]) {
    landmarks.value = newLandmarks;
  }

  function removeLandmark(landmarkId: string) {
    landmarks.value = landmarks.value.filter((landmark) => landmark.id !== landmarkId);
  }

  // to be implemented
  function updateLandmark() {
    // ...
  }

  function setUserId(newUserId: string) {
    userId.value = newUserId;
  }

  const landmarksByUserId = computed(() =>
    landmarks.value.filter((landmark) => landmark.userId === userId.value),
  );

  return {
    landmarks,
    userId,
    setLandmarks,
    removeLandmark,
    updateLandmark,
    setUserId,
    landmarksByUserId,
  };
});
