<script setup lang="ts">
interface Props {
  landmark: Landmark;
}

defineProps<Props>();
</script>

<template>
  <div class="landmarks-list-item">
    <div class="landmarks-list-item__left">
      <img class="landmarks-list-item__img" :src="landmark.images[0]" />
    </div>
    <div class="landmarks-list-item__right">
      <div class="landmarks-list-item__name">
        {{ landmark.name }}
      </div>
      <div class="landmarks-list-item__rating">Rating: {{ landmark.rating }} ⭐</div>
    </div>
  </div>
</template>

<style scoped>
.landmarks-list-item {
  width: 95%;
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  column-gap: 20px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  min-height: 120px;
}

.landmarks-list-item:hover {
  background-color: var(--bg-color-calendar-hover);
  cursor: pointer;
}

.landmarks-list-item__left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.landmarks-list-item__img {
  width: 85px;
  height: 85px;
  object-fit: cover;
  border-radius: 8px;
}

.landmarks-list-item__right {
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  row-gap: 10px;
}

.landmarks-list-item__name {
  font-size: 23px;
  font-weight: bold;
}
</style>
