<script setup lang="ts">
import BaseMap from '@/components/BaseMap.vue';
import LandmarksList from '@/components/LandmarksList.vue';
import { useLandmarksStore } from '@/stores/landmarks';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import LandmarkItemModal from '@/components/LandmarkItemModal.vue';

const landmarksStore = useLandmarksStore();
const { landmarks, landmarksByUserId } = storeToRefs(landmarksStore);

const landmarkMarkers = ref<{ id: string; lat: number; lng: number }[]>([]);
const isLandmarkViewModalOpened = ref(false);
const currentViewingLandmark = ref<Landmark>();

function openLandmarkViewModal(landmarkId: string) {
  currentViewingLandmark.value = landmarksStore.getLandmarkById(landmarkId);
  isLandmarkViewModalOpened.value = true;
}
const closeLandmarkViewModal = () => {
  isLandmarkViewModalOpened.value = false;
};

const baseMap = ref();

function zoomToLandmark(landmarkId: string) {
  if (baseMap.value) {
    baseMap.value.zoomToLandmark(landmarkId);
    console.log('zooming to landmark', landmarkId);
  }
}

watch(landmarks, (newLandmarks) => {
  console.log('updateddada');
  landmarkMarkers.value = [];
  newLandmarks.forEach((landmark) => {
    landmarkMarkers.value.push({ id: landmark.id!, lat: landmark.lat, lng: landmark.long });
  });
});
</script>

<template>
  <div class="main__container">
    <BaseMap
      :landmark-markers="landmarkMarkers"
      @opened-landmark-view-modal="openLandmarkViewModal"
      ref="baseMap"
    />
    <LandmarksList
      :landmark-markers="landmarkMarkers"
      :landmarks="landmarks"
      :landmarks-by-user-id="landmarksByUserId"
      @zoom-to-landmark="zoomToLandmark"
    />
    <Transition name="fade">
      <LandmarkItemModal
        v-if="isLandmarkViewModalOpened"
        :is-modal-opened="isLandmarkViewModalOpened"
        :close-modal="closeLandmarkViewModal"
        :landmark="currentViewingLandmark!"
      ></LandmarkItemModal>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
