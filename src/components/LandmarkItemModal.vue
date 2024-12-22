<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';
import { ref, onMounted, reactive } from 'vue';
import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';

interface Props {
  isModalOpened: boolean;
  closeModal: () => void;
  landmark: Landmark;
  isUserAdmin: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits(['modal-close-button']);

const editedLandmark = reactive<Partial<Landmark>>({
  userId: props.landmark.userId,
  userRating: props.landmark.userRating,
  name: props.landmark.name,
  description: props.landmark.description,
});

const landmarksStore = useLandmarksStore();
const userStore = useUserStore();

const canEdit = ref(false);
const newRating = ref<number>(5);

async function updateLandmarkRating(newRating: number) {
  if (!canEdit.value && !props.isUserAdmin) {
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
  } else {
    await landmarksStore.updateLandmark(props.landmark.id!, editedLandmark);
  }
}

function adminDeleteLandmark() {
  landmarksStore.deleteLandmark(props.landmark.userId, props.landmark.id!);
  props.closeModal();
}

onMounted(async () => {
  canEdit.value = userStore.userId === props.landmark.userId;
  console.log(canEdit.value);

  console.log('from modal ', props.isUserAdmin);
});
</script>

<template>
  <BaseModal
    :button-text="'Save changes'"
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
          <p>Landmark owner's rating: ⭐ {{ landmark.userRating }}</p>
        </div>
        <div class="modal-body__edit" v-if="canEdit || props.isUserAdmin">
          <p class="modal-body__title">
            You can edit this landmark because you're the
            {{ props.isUserAdmin ? 'ADMIN' : 'owner' }}
          </p>
          <label for="title">Title</label>
          <input
            id="title"
            class="modal-body__input title"
            type="text"
            v-model="editedLandmark.name"
            placeholder="Name"
            maxlength="40"
          />
          <label for="description">Description</label>
          <textarea
            id="description"
            class="modal-body__input description"
            v-model="editedLandmark.description"
            placeholder="Description"
            maxlength="120"
          />
          <template v-if="!props.isUserAdmin">
            <label for="rating">Rating</label>
            <select
              class="modal-body__input rating"
              v-model="editedLandmark.userRating"
              name="ratingValue"
              id="rating"
            >
              <option value="1">⭐</option>
              <option value="2">⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
            </select>
          </template>
          <BaseButton :custom-styles="'custom-btn-delete'" @click="adminDeleteLandmark"
            >Delete</BaseButton
          >
        </div>
        <div v-else>
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

.modal-body__title {
  font-size: 20px;
  font-weight: bold;
  color: var(--button-main-color);
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

.title {
  outline: none;
}

.description {
  resize: none;
  outline: none;
  font-family: 'Mulish', serif;
}

.rating:focus {
  outline: none;
}

.modal-body__edit {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.custom-btn-delete {
  background-color: var(--button-delete-color);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.4s ease;
}
</style>
