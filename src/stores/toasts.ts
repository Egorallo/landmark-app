import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastsStore = defineStore('toasts', () => {
  const toasts = ref<string[]>([]);

  function addToast(message: string) {
    toasts.value.push(message);
  }

  return { toasts, addToast };
});
