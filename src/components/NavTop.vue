<script setup lang="ts">
import { signOut } from '@/services/authService';
import IconSignOut from './icons/IconSignOut.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

async function handleSignOut() {
  await signOut();
  router.push('/sign-in');
}
</script>

<template>
  <nav class="nav">
    <div class="nav-left">Landmarks 2025 📍</div>
    <div class="nav-right">
      <div class="nav-right__text">Log out</div>
      <button class="nav-right__button" @click="handleSignOut">
        <IconSignOut :color="'var(--color-icon)'" :width="'20px'" :height="'20px'"></IconSignOut>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
}

.nav-left {
  font-size: 20px;
  color: #00ffe5;
}

.nav-right {
  display: flex;
  gap: 10px;
  font-size: 14px;
  align-items: flex-start;
}

.nav-right__button {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 0;
  cursor: pointer;
}
</style>
