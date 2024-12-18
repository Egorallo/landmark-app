<script setup lang="ts">
import BaseMap from '@/components/BaseMap.vue';
import LandmarksList from '@/components/LandmarksList.vue';
import { useLandmarksStore } from '@/stores/landmarks';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const landmarksStore = useLandmarksStore();
const { landmarks, landmarksByUserId } = storeToRefs(landmarksStore);

const landmarkMarkers = ref<{ lat: number; lng: number }[]>([]);
watch(landmarks, (newLandmarks) => {
  console.log('updateddada');
  landmarkMarkers.value = [];
  newLandmarks.forEach((landmark) => {
    landmarkMarkers.value.push({ lat: landmark.lat, lng: landmark.long });
  });
});
</script>

<template>
  <div class="main__container">
    <BaseMap :landmark-markers="landmarkMarkers" />
    <LandmarksList
      :landmark-markers="landmarkMarkers"
      :landmarks="landmarks"
      :landmarks-by-user-id="landmarksByUserId"
    />
  </div>
</template>

<style scoped>
.main__container {
  width: 100%;
  height: 100%;
  display: grid;
  column-gap: 10px;
  grid-template-columns: 1fr 400px;
}

@media (max-width: 750px) {
  .main__container {
    display: grid;
    row-gap: 10px;
    grid-template-columns: none;
    grid-template-rows: 1fr 200px;
  }
}
</style>
