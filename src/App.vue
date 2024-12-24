<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseInit';
import ToastNotification from './components/ToastNotification.vue';
import { useToastsStore } from './stores/toasts';
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';
import NavTop from './components/NavTop.vue';

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
  <NavTop v-if="isLogged" />
  <ToastNotification :toasts="toasts"></ToastNotification>
  <RouterView />
</template>

<style scoped></style>
