<script setup lang="ts">
import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

interface Landmark {
  id?: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
  long: number;
  lat: number;
}

const landmarksStore = useLandmarksStore();
const userStore = useUserStore();

const userId = userStore.userId;
const { landmarks, landmarksByUserId } = storeToRefs(landmarksStore);

watch(landmarks, (newLandmarks) => {
  console.log('Landmarks updated:', newLandmarks);
});

watch(landmarksByUserId, (newLandmarksByUserId) => {
  console.log('Landmarks by User ID updated:', newLandmarksByUserId);
});

const newLandmark = ref<Landmark>({
  id: '',
  userId: userId!,
  userRating: 0,
  name: '',
  description: '',
  rating: 0,
  long: 0,
  lat: 0,
});

function addNewLandmark(landmark: Landmark) {
  landmarksStore.addLandmark(landmark);
  newLandmark.value.description = '';
  newLandmark.value.name = '';
  newLandmark.value.rating = 0;
  newLandmark.value.long = 0;
  newLandmark.value.lat = 0;
}
</script>

<template>
  <div class="landmarks-list">
    <div class="landmarks-list__container" v-if="landmarks.length">
      <div class="landmarks-list__item" v-for="landmark in landmarks" :key="landmark.id">
        {{ landmark.name }}
      </div>
    </div>
    <input type="text" v-model="newLandmark.name" placeholder="" />
    <input type="text" v-model="newLandmark.description" placeholder="" />
    <input type="number" v-model="newLandmark.rating" placeholder="" />
    <input type="number" v-model="newLandmark.long" placeholder="" />
    <input type="number" v-model="newLandmark.lat" placeholder="" />

    <button @click="addNewLandmark(newLandmark)">Finish</button>
  </div>
</template>

<style scoped>
.landmarks-list {
  border: 1px solid red;
}
.landmarks-list__container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
