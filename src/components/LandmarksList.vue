<script setup lang="ts">
// import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';
import { ref, computed } from 'vue';
// import { storeToRefs } from 'pinia';
import LandmarksListItem from './LandmarksListItem.vue';
import BaseButton from './BaseButton.vue';
import LandmarkAddModal from './LandmarkAddModal.vue';
import LandmarkItemModal from './LandmarkItemModal.vue';
import TriggerLoad from './TriggerLoad.vue';

interface Props {
  landmarks: Landmark[];
  landmarksByUserId: Landmark[];
  landmarkMarkers: { id: string; lat: number; lng: number }[];
}

const props = defineProps<Props>();
const emits = defineEmits(['zoom-to-landmark']);

const isModalOpened = ref(false);
const isLandmarkViewModalOpened = ref(false);
const currentViewingLandmark = ref<Landmark>();

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const openLandmarkViewModal = (landmark: Landmark) => {
  isLandmarkViewModalOpened.value = true;
  currentViewingLandmark.value = landmark;
  emits('zoom-to-landmark', landmark.id);
};

const closeLandmarkViewModal = () => {
  isLandmarkViewModalOpened.value = false;
};

const userStore = useUserStore();

const userId = userStore.userId;
const showOnlyUserLandmarks = ref(false);

const displayedLandmarks = computed(() => {
  return showOnlyUserLandmarks.value ? props.landmarksByUserId : props.landmarks;
});

function loadMoreLandmarks() {
  console.log('loading more landmarks');
}
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
        @click="openLandmarkViewModal(landmark)"
      ></LandmarksListItem>
      <TriggerLoad @intersected="loadMoreLandmarks" />
    </div>
    <div v-else>No landmarks available.</div>

    <BaseButton custom-styles="custom-b-class" @click="openModal">Add new landmark +</BaseButton>
    <Transition name="fade">
      <LandmarkAddModal
        v-if="isModalOpened"
        :isModalOpened="isModalOpened"
        :user-id="userId"
        :close-modal="closeModal"
        :landmark-markers="props.landmarkMarkers"
        @modal-close-button="closeModal"
      />
    </Transition>
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
  margin-top: 10px;
  margin-bottom: 10px;
}

@media (max-width: 750px) {
  .landmarks-list__container {
    max-height: 410px;
  }
}
</style>
