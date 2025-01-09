<script setup lang="ts">
import MapBox from '@/components/MapBox.vue';
import LandmarksList from '@/components/LandmarksList.vue';
import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import LandmarkItemModal from '@/components/LandmarkItemModal.vue';
import { checkIfAdmin } from '@/services/authService';

const landmarksStore = useLandmarksStore();
const userStore = useUserStore();

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

const isUserAdmin = ref(false);

const mapBox = ref();

function zoomToLandmark(landmarkId: string) {
  if (mapBox.value) {
    mapBox.value.zoomToLandmark(landmarkId);
  }
}

onMounted(async () => {
  isUserAdmin.value = await checkIfAdmin(userStore.userId!);
});

watch(landmarks, (newLandmarks) => {
  landmarkMarkers.value = [];
  newLandmarks.forEach((landmark) => {
    landmarkMarkers.value.push({ id: landmark.id!, lat: landmark.lat, lng: landmark.long });
  });
});
</script>

<template>
  <div class="main__container">
    <MapBox
      :landmark-markers="landmarkMarkers"
      @opened-landmark-view-modal="openLandmarkViewModal"
      ref="mapBox"
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
        :is-user-admin="isUserAdmin"
      ></LandmarkItemModal>
    </Transition>
  </div>
</template>

<style scoped>
.main__container {
  width: 100%;
  height: 100%;
  display: grid;
  column-gap: 10px;
  grid-template-columns: 2fr 1fr;
  overflow: hidden;
}

@media (max-width: 750px) {
  .main__container {
    display: grid;
    row-gap: 10px;
    grid-template-columns: none;
    grid-template-rows: 1fr 2fr;
  }
}
</style>
