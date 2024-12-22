<script setup lang="ts">
import { signOut } from '@/services/authService';
import IconSignOut from './icons/IconSignOut.vue';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getCurrentUser } from '@/services/authService';
import { generateHexColor } from '@/utils/radnomHexColor';

const router = useRouter();
const userEmail = ref('');
const pfpColor = ref('');

const userPfp = computed(() => (userEmail.value || '').slice(0, 2));

async function handleSignOut() {
  await signOut();
  router.push('/sign-in');
}

onMounted(async () => {
  const user = await getCurrentUser();
  userEmail.value = user?.email || '';
  pfpColor.value = generateHexColor();
});
</script>

<template>
  <nav class="nav">
    <div class="nav-left">Landmarks 2025 📍</div>
    <div class="nav-right">
      <select class="nav-right__lang" v-model="$i18n.locale">
        <option value="en">En</option>
        <option value="ru">Ru</option>
      </select>
      <div class="nav-right__profile-pic">
        <div class="nav-right__profile-pic-text">{{ userPfp }}</div>
      </div>

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
  margin-bottom: 9px;
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

.nav-right__lang {
  background-color: var(--bg-color-calendar-selected);
  border: 1px solid var(--border-calendar-color);
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

.nav-right__profile-pic {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: v-bind(pfpColor);
}

.nav-right__profile-pic-text {
  user-select: none;
  color: var(--button-text-color);
  letter-spacing: 1px;
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
