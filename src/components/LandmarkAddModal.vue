<script setup lang="ts">
import BaseModal from './BaseModal.vue';
import BaseMap from './BaseMap.vue';
import { ref, reactive, computed } from 'vue';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/constants/files';
import { useLandmarksStore } from '@/stores/landmarks';
import { compressImage } from '@/utils/imageCompressor';

interface Props {
  isModalOpened: boolean;
  userId: string | null;
  closeModal: () => void;
  landmarkMarkers: { id: string; lat: number; lng: number }[];
}

const props = defineProps<Props>();
const landmarksStore = useLandmarksStore();
const emits = defineEmits(['modal-close-button']);

const newLandmark = reactive<Landmark>({
  id: '',
  userId: props.userId!,
  userRating: 0,
  name: '',
  description: '',
  rating: 5,
  totalRating: 5,
  visitors: 1,
  long: 0,
  lat: 0,
  images: [],
});

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[] | null>(null);

function handleFileChange() {
  const selectedFiles = Array.from(fileInput.value!.files || []);

  if (selectedFiles.length > MAX_FILES) {
    alert(`You can only upload up to ${MAX_FILES} images.`);
    fileInput.value!.value = '';
    files.value = [];
    return;
  }

  const oversizedFiles = selectedFiles.filter((file) => file.size / 1024 / 1024 > MAX_FILE_SIZE_MB);
  if (oversizedFiles.length > 0) {
    alert(`Each file must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
    fileInput.value!.value = '';
    files.value = [];
    return;
  }

  files.value = selectedFiles;
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    if (fileInput.value) {
      fileInput.value.files = files;
    }
    handleFileChange();
  }
};

async function addNewLandmark(landmark: Landmark) {
  const compressedImages: string[] = [];
  for (const file of files.value!) {
    try {
      const compressedImage = await compressImage(file, 0.45);
      compressedImages.push(compressedImage);
    } catch (_) {
      alert('Failed to process one of the images. Please try again.');
      return;
    }
  }
  landmark.userRating = +landmark.rating;
  landmark.totalRating = +landmark.rating;

  landmark.images = compressedImages;

  await landmarksStore.addLandmark(landmark);
  await landmarksStore.fetchLandmarks();
}

function handleNewMarker({ fl, lat, lng }: { fl: boolean; lat: number; lng: number }) {
  if (!fl) {
    newLandmark.lat = 0;
    newLandmark.long = 0;
    return;
  }
  newLandmark.lat = lat;
  newLandmark.long = lng;
}

const canAdd = computed(() => {
  return (
    newLandmark.name.trim().length > 0 &&
    newLandmark.description.length > 0 &&
    newLandmark.lat !== 0 &&
    newLandmark.long !== 0 &&
    files.value
  );
});
</script>

<template>
  <BaseModal
    :button-text="$t('common.button-add')"
    :is-open="isModalOpened"
    @submit="addNewLandmark(newLandmark)"
    @modal-close="closeModal"
    :button-disabled="!canAdd"
  >
    <template #header>
      <div class="modal-header flex-space-between">
        <h3 class="modal-hedaer__text">{{ $t('landmarkAddModal.header') }}</h3>
        <button class="modal-header__button" @click="emits('modal-close-button')">❌</button>
      </div>
    </template>

    <template #content>
      <div class="modal-body">
        <BaseMap
          :landmark-markers="props.landmarkMarkers"
          @placed-marker="handleNewMarker"
          :add-markers="true"
          class="mappa"
        ></BaseMap>
        <input
          class="modal-body__input title"
          type="text"
          v-model="newLandmark.name"
          :placeholder="$t('common.name')"
          maxlength="40"
        />
        <textarea
          class="modal-body__input description"
          v-model="newLandmark.description"
          :placeholder="$t('common.description')"
          maxlength="120"
        />
        <label for="rating">{{ $t('landmarkAddModal.rating') }}</label>
        <select
          class="modal-body__input rating"
          v-model="newLandmark.rating"
          name="ratingValue"
          id="rating"
        >
          <option value="1">⭐</option>
          <option value="2">⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
        </select>
        <div class="modal-body__input__file__container">
          <label
            for="fileInput"
            class="modal-body__input__file__text flex-center"
            @dragover.prevent
            @drop="handleDrop"
          >
            {{ $t('landmarkAddModal.imageUpload') }}
          </label>
          <input
            class="modal-body__input file"
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            multiple
            id="fileInput"
          />
          <div>{{ $t('landmarkAddModal.imagesUploaded') }} {{ files?.length }}</div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.mappa {
  min-height: 300px;
}

.modal-body__input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--input-border-color);
  border-radius: 5px;
}

.title {
  font-family: 'Mulish', serif;
  outline: none;
}

.description {
  resize: none;
  font-family: 'Mulish', serif;
  outline: none;
}

.rating {
  outline: none;
}
.modal-body__input__file__container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-body__input__file__text {
  padding: 10px;
  cursor: pointer;
  color: var(--text-file-select);
  border-radius: 8px;
  margin-bottom: 10px;
  height: 100px;
  background-color: var(--bg-color-file-select);
  border: 1px dashed var(--border-file-select-color);
}

.file {
  display: none;
}

@media (max-width: 750px) {
  .mappa {
    height: 220px;
  }
}
</style>
