<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  imageSrc: string;
  altText?: string;
}>();

const isPreviewVisible = ref(false);

function openPreview() {
  isPreviewVisible.value = true;
}

function closePreview() {
  isPreviewVisible.value = false;
}
</script>

<template>
  <div>
    <img :src="imageSrc" :alt="altText" class="thumbnail" @click="openPreview" />

    <div v-if="isPreviewVisible" class="fullscreen-overlay" @click="closePreview">
      <img :src="imageSrc" :alt="altText" class="fullscreen-image" />
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
  max-width: 300px;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.fullscreen-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>
