<script setup lang="ts">
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
  landmark: Landmark;
}

defineProps<Props>();
</script>

<template>
  <div class="landmarks-list-item">
    <div class="landmarks-list-item__photo">
      <img class="landmarks-list-item__img" :src="landmark.images[0]" />
    </div>
    <div class="landmarks-list-item__name">
      {{ landmark.name }}
    </div>
    <div class="landmarks-list-item__rating">Rating: {{ landmark.rating }}</div>
  </div>
</template>

<style scoped>
.landmarks-list-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.landmarks-list-item__img {
  width: 120px;
  height: 120px;
  /* object-fit: fill; */
  border-radius: 5px;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
}
</style>
