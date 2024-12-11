<script setup lang="ts">
interface Props {
  toasts: string[];
}
defineProps<Props>();
</script>

<template>
  <div v-if="toasts.length" class="toast-container">
    <div v-for="(toast, index) in toasts" :key="index" class="toast">
      {{ toast }}
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 9999;
}
.toast {
  background-color: red;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
