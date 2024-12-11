<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseInit';
import ToastNotification from './components/ToastNotification.vue';
import { useToastsStore } from './stores/toasts';
import { useLandmarksStore } from './stores/landmarks';
import { storeToRefs } from 'pinia';

const isLogged = ref(false);
const toastsStore = useToastsStore();
const landmarksStore = useLandmarksStore();

const { toasts } = storeToRefs(toastsStore);

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      landmarksStore.initializeUser();
      isLogged.value = true;
    } else {
      isLogged.value = false;
    }
  });
});
</script>

<template>
  <ToastNotification :toasts="toasts"></ToastNotification>
  <RouterView />
</template>
