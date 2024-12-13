<script setup lang="ts">
import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import LandmarksListItem from './LandmarksListItem.vue';
import BaseButton from './BaseButton.vue';
import LandmarkAddModal from './LandmarkAddModal.vue';

const isModalOpened = ref(false);

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const landmarksStore = useLandmarksStore();
const userStore = useUserStore();

const userId = userStore.userId;
const showOnlyUserLandmarks = ref(false);
const { landmarks, landmarksByUserId } = storeToRefs(landmarksStore);

const displayedLandmarks = computed(() => {
  console.log('accessed computed landmarks');
  return showOnlyUserLandmarks.value ? landmarksByUserId.value : landmarks.value;
});

watch(displayedLandmarks, (newDisplayedLandmarks) => {
  console.log('Displayed landmarks updated:', newDisplayedLandmarks);
});

watch(landmarks, (newLandmarks) => {
  console.log('Landmarks updated:', newLandmarks);
});

watch(landmarksByUserId, (newLandmarksByUserId) => {
  console.log('Landmarks by User ID updated:', newLandmarksByUserId);
});
</script>

<template>
  <div class="landmarks-list">
    <div class="landmarks-list__header">
      <div class="landmarks-list__header__title">Top 10 Places</div>
      <input
        class="landmarks-list__header__checkbox"
        type="checkbox"
        v-model="showOnlyUserLandmarks"
      />
      <label class="landmarks-list__header__label">Show only my landmarks</label>
    </div>
    <div class="landmarks-list__container" v-if="landmarks.length">
      <LandmarksListItem
        v-for="landmark in displayedLandmarks"
        :key="landmark.id"
        :landmark="landmark"
      ></LandmarksListItem>
    </div>
    <div v-else>No landmarks available.</div>

    <BaseButton custom-styles="custom-b-class" @click="openModal">Add new landmark +</BaseButton>
    <LandmarkAddModal :user-id="userId" :isModalOpened="isModalOpened" :closeModal="closeModal" />
  </div>
</template>

<style scoped>
.custom-b-class {
  width: 50%;
}

.landmarks-list__title {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  line-height: auto;
  font-size: 20px;
  font-weight: bold;
  margin-top: -5px;
  margin-bottom: 10px;
}

.landmarks-list {
  /* border: 1px solid red; */
  overflow: auto;
}
.landmarks-list__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 5px;
  height: 700px;
  overflow: auto;
}

@media (max-width: 750px) {
  .landmarks-list__container {
    max-height: 410px;
  }
}
</style>
