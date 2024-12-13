<script setup lang="ts">
import { useLandmarksStore } from '@/stores/landmarks';
import { useUserStore } from '@/stores/user';
import { reactive, ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import LandmarksListItem from './LandmarksListItem.vue';
import { compressImage } from '@/utils/imageCompressor';
import { MAX_FILES, MAX_FILE_SIZE_MB } from '@/constants/files';

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

const landmarksStore = useLandmarksStore();
const userStore = useUserStore();

const fileInput = ref<HTMLInputElement | null>(null);
const files = ref<File[] | null>(null);

const userId = userStore.userId;
const showOnlyUserLandmarks = ref(false);
const { landmarks, landmarksByUserId } = storeToRefs(landmarksStore);

const displayedLandmarks = computed(() => {
  console.log('accessed computed landmarks');
  return showOnlyUserLandmarks.value ? landmarksByUserId.value : landmarks.value;
});

const newLandmark = reactive<Landmark>({
  id: '',
  userId: userId!,
  userRating: 0,
  name: '',
  description: '',
  rating: 0,
  long: 0,
  lat: 0,
  images: [],
});

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
  fileInput.value!.value = '';
}

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

    <input type="text" v-model="newLandmark.name" placeholder="" />
    <input type="text" v-model="newLandmark.description" placeholder="" />
    <input type="number" v-model="newLandmark.rating" placeholder="" />
    <input type="number" v-model="newLandmark.long" placeholder="" />
    <input type="number" v-model="newLandmark.lat" placeholder="" />
    <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" multiple />

    <button @click="addNewLandmark(newLandmark)">Finish</button>
  </div>
</template>

<style scoped>
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
