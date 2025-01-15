<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  customStyles?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['click']);

const buttonClass = computed(() => `base-button ${props.customStyles || ''}`);
</script>

<template>
  <button
    :class="buttonClass"
    :type="props.type || 'button'"
    :disabled="props.disabled"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  font-family: 'Mulish', serif;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: var(--button-main-color);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.4s ease;
}

button:hover {
  background-color: var(--button-main-color-hover);
}

button:disabled {
  background-color: var(--button-disabled-color);
  cursor: not-allowed;
}
</style>
