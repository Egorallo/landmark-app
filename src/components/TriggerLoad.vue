<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const emits = defineEmits(['intersected']);

const trigger = ref<HTMLElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  observer.value = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      emits('intersected');
    }
  });
  observer.value.observe(trigger.value as HTMLElement);
});

onUnmounted(() => {
  observer.value?.disconnect();
});
</script>

<template>
  <div ref="trigger" class="trigger"></div>
</template>

<style scoped>
.trigger {
  width: 0;
  height: 0;
}
</style>
