import { getCurrentUser } from '@/services/authService';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const userId = ref<string | null>(null);
  const isAdmin = ref<boolean>(false);

  async function initializeUser() {
    const user = await getCurrentUser();
    if (user) {
      userId.value = user.uid;
    }
  }

  return { userId, isAdmin, initializeUser };
});
