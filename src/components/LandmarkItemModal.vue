<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import { ref } from 'vue';
import { useLandmarksStore } from '@/stores/landmarks';

interface Props {
  isModalOpened: boolean;
  closeModal: () => void;
  landmark: Landmark;
}

const props = defineProps<Props>();
const emits = defineEmits(['modal-close-button']);
const landmarksStore = useLandmarksStore();

const newRating = ref(5);

async function updateLandmarkRating(newRating: number) {
  const res = await landmarksStore.updateLandmarkRating(
    props.landmark.id!,
    props.landmark.userId,
    +newRating,
  );
  if (res) {
    console.log('Rating updated successfully');
    await landmarksStore.fetchLandmarks();
    props.closeModal();
  } else {
    console.log('Rating update failed');
  }
}
</script>

<template>
  <BaseModal
    :button-text="'Set new rating'"
    :is-open="isModalOpened"
    @submit="updateLandmarkRating(newRating)"
    @modal-close="closeModal"
  >
    <template #header>
      <div class="modal-header">
        <h3>{{ landmark.name }}</h3>
        <button class="modal-header__button" @click="emits('modal-close-button')">❌</button>
      </div>
    </template>

    <template #content>
      <div class="modal-body">
        <div class="modal-body__image__container">
          <img
            class="modal-body__image"
            v-for="(image, id) in landmark.images"
            :src="image"
            :key="id"
          />
        </div>
        <div class="modal-body__user__rating">
          <p>Current Rating: ⭐ {{ landmark.rating }}</p>
        </div>
        <div class="modlal-body__description">
          <p>{{ landmark.description }}</p>
        </div>
        <div class="modal-body__rating__container">
          <label for="rating">How you like it: </label>
          <select
            class="modal-body__input rating"
            v-model="newRating"
            name="ratingValue"
            id="rating"
          >
            <option value="1">⭐</option>
            <option value="2">⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="5">⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header__button {
  background-color: transparent;
  padding: 0;
  margin: 0;
  line-height: 0;
  border: none;
}

.modal-header__button:hover {
  cursor: pointer;
}

.modal-body {
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  margin-bottom: 10px;
}

.modal-body__image__container {
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.modal-body__image {
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.modal-body__rating__container {
  display: flex;
  justify-content: space-between;
}

.rating {
  background-color: var(--bg-color-calendar-hover);
}

.rating:focus {
  outline: none;
}
</style>
