<script setup lang="ts">
import BaseModal from './BaseModal.vue';
// import BaseMap from './BaseMap.vue';
import { ref, reactive } from 'vue';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/constants/files';
import { useLandmarksStore } from '@/stores/landmarks';
import { compressImage } from '@/utils/imageCompressor';

interface Landmark {
  id?: string;
  userId: string;
  userRating: number;
  name: string;
  description: string;
  rating: number;
  long: number;
  lat: number;
  images: string[];
}

interface Props {
  isModalOpened: boolean;
  userId: string | null;
  closeModal: () => void;
}

const props = defineProps<Props>();
const landmarksStore = useLandmarksStore();

const newLandmark = reactive<Landmark>({
  id: '',
  userId: props.userId!,
  userRating: 0,
  name: '',
  description: '',
  rating: 0,
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

async function addNewLandmark(landmark: Landmark) {
  if (!files.value || files.value.length === 0) {
    alert('Please select at least one image.');
    return;
  }

  const compressedImages: string[] = [];
  for (const file of files.value) {
    try {
      const compressedImage = await compressImage(file, 0.5);
      compressedImages.push(compressedImage);
    } catch (error) {
      console.error('Image compression failed:', error);
      alert('Failed to process one of the images. Please try again.');
      return;
    }
  }

  landmark.images = compressedImages;

  await landmarksStore.addLandmark(landmark);

  newLandmark.description = '';
  newLandmark.name = '';
  newLandmark.rating = 0;
  newLandmark.long = 0;
  newLandmark.lat = 0;
  files.value = null;
  fileInput.value = null;
}
</script>

<template>
  <BaseModal
    :button-text="'Add'"
    :is-open="isModalOpened"
    @submit="addNewLandmark(newLandmark)"
    @modal-close="closeModal"
  >
    <template #header>
      <h2>Add new landmark</h2>
    </template>

    <template #content>
      <input type="text" v-model="newLandmark.name" placeholder="Name" />
      <input type="text" v-model="newLandmark.description" placeholder="Description" />
      <input type="number" v-model="newLandmark.rating" placeholder="Rating" />
      <input type="number" v-model="newLandmark.long" placeholder="Longitude" />
      <input type="number" v-model="newLandmark.lat" placeholder="Latitude" />
      <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" multiple />
    </template>
  </BaseModal>
</template>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
}
</style>
