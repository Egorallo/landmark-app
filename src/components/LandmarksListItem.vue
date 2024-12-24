<script setup lang="ts">
interface Props {
  landmark: Landmark;
}

defineProps<Props>();
</script>

<template>
  <div class="landmarks-list-item">
    <div class="landmarks-list-item__left flex-center">
      <img class="landmarks-list-item__img" :src="landmark.images[0]" />
    </div>
    <div class="landmarks-list-item__right">
      <div class="landmarks-list-item__name">
        {{ landmark.name }}
      </div>
      <div class="landmarks-list-item__rating">
        {{ $t('landmarksListItem.rating') }} {{ landmark.rating }} ⭐
      </div>
    </div>
  </div>
</template>

<style scoped>
.landmarks-list-item {
  width: 100%;
  min-height: 85px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: flex-start;
  column-gap: 20px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
  max-height: 120px;
}

.landmarks-list-item:hover {
  background-color: var(--bg-color-landmark-item);
  cursor: pointer;
}

.landmarks-list-item__img {
  width: 65px;
  height: 65px;
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
  width: 100%;
  overflow: hidden;
}

.landmarks-list-item__name {
  font-size: 23px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
