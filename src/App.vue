<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseInit';
import ToastNotification from './components/ToastNotification.vue';
import { useToastsStore } from './stores/toasts';
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';

const isLogged = ref(false);
const toastsStore = useToastsStore();
const userStore = useUserStore();

const { toasts } = storeToRefs(toastsStore);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userStore.initializeUser();
      isLogged.value = true;
    } else {
      isLogged.value = false;
    }
  });
});
</script>

<template>
  <div class="nav">Landmarks 2025 📍</div>
  <ToastNotification :toasts="toasts"></ToastNotification>
  <RouterView />
</template>

<style scoped>
.nav {
  width: 100%;
  height: 30px;
  font-size: 20px;
  color: #00ffe5;
}
</style>
