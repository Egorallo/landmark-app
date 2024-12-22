<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, computed, onMounted } from 'vue';
import LandmarksListItem from './LandmarksListItem.vue';
import BaseButton from './BaseButton.vue';
import LandmarkAddModal from './LandmarkAddModal.vue';
import LandmarkItemModal from './LandmarkItemModal.vue';
import TriggerLoad from './TriggerLoad.vue';
import { checkIfAdmin } from '@/services/authService';

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

const isUserAdmin = ref(false);

const userId = userStore.userId;
const showOnlyUserLandmarks = ref(false);

const displayedLandmarks = computed(() => {
  return showOnlyUserLandmarks.value ? props.landmarksByUserId : props.landmarks;
});

function loadMoreLandmarks() {
  console.log('loading more landmarks');
}
onMounted(async () => {
  isUserAdmin.value = await checkIfAdmin(userId!);
  console.log(isUserAdmin.value);
  console.log(userId);
});
</script>

<template>
  <div class="landmarks-list">
    <div class="landmarks-list__header">
      <div class="landmarks-list__heder__left">
        <div class="landmarks-list__header__title">{{ $t('landmarksList.top10') }}</div>
        <input
          class="landmarks-list__header__checkbox"
          type="checkbox"
          v-model="showOnlyUserLandmarks"
        />
        <label class="landmarks-list__header__label">{{
          $t('landmarksList.onlyMyLandmarks')
        }}</label>
      </div>
      <div class="landmarks-list__header__right">
        <BaseButton custom-styles="custom-b-class" @click="openModal" :disabled="isUserAdmin">{{
          $t('common.button-add')
        }}</BaseButton>
      </div>
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
    <div v-else>{{ $t('landmarksList.noLandmarks') }}</div>

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
        :is-user-admin="isUserAdmin"
        @modal-close-button="closeLandmarkViewModal"
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
  width: 100%;
}

.landmarks-list {
  padding: 0px 10px 10px 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.landmarks-list__header {
  display: flex;
  justify-content: space-between;
}

.landmarks-list__header__title {
  font-weight: bold;
  font-size: 18px;
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

.landmarks-list__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 8px;
  row-gap: 10px;
}

@media (max-width: 750px) {
  .landmarks-list__container {
    max-height: 55vh;
  }
}
</style>
