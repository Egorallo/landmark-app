<script setup lang="ts">
import BaseMap from '@/components/BaseMap.vue';
import LandmarksList from '@/components/LandmarksList.vue';
</script>

<template>
  <div class="main__container">
    <BaseMap />
    <LandmarksList />
  </div>
</template>

<style scoped>
.main__container {
  width: 100%;
  height: 100%;
  display: grid;
  column-gap: 10px;
  grid-template-columns: 1fr 300px;
}

@media (max-width: 750px) {
  .main__container {
    display: grid;
    row-gap: 10px;
    grid-template-columns: none;
    grid-template-rows: 1fr 200px;
  }
}
</style>
