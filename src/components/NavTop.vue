<script setup lang="ts">
import { signOut } from '@/services/authService';
import IconSignOut from './icons/IconSignOut.vue';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getCurrentUser } from '@/services/authService';
import { generateHexColor } from '@/utils/radnomHexColor';
import BaseButton from '@/components/BaseButton.vue';

const router = useRouter();
const userEmail = ref('');
const pfpColor = ref('white');

const userPfp = computed(() => (userEmail.value || '').slice(0, 2));

async function handleSignOut() {
  await signOut();
  router.push('/sign-in');
}

function changePfpColor() {
  pfpColor.value = generateHexColor();
}

onMounted(async () => {
  const user = await getCurrentUser();
  userEmail.value = user?.email || '';
});
</script>

<template>
  <nav class="nav">
    <div class="nav-left">Landmarks 2025 📍</div>
    <div class="nav-right">
      <BaseButton
        :custom-styles="'custom-btn-locale'"
        @click="
          {
            $i18n.locale === 'en' ? ($i18n.locale = 'ru') : ($i18n.locale = 'en');
          }
        "
        >{{ $i18n.locale.toUpperCase() }}</BaseButton
      >
      <div class="nav-right__profile-pic flex-center">
        <div class="nav-right__profile-pic-text" @click="changePfpColor">{{ userPfp }}</div>
      </div>

      <button class="nav-right__button" @click="handleSignOut">
        <IconSignOut :color="'var(--color-icon)'" :width="'27px'" :height="'27px'"></IconSignOut>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.custom-btn-locale {
  height: 100%;
  background-color: var(--button-locale-color);
  color: var(--button-locale-text-color);
  font-size: 12;
  padding: 0 10px;
  width: 40px;
}

.custom-btn-locale:hover {
  background-color: var(--button-locale-color-hover);
}

.nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 30px;
  margin-bottom: 9px;
}

.nav-left {
  font-size: 20px;
  color: var(--color-nav-left);
}

.nav-right {
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: space-between;
  width: 150px;
}

.nav-right__lang {
  background-color: var(--bg-color-lang);
  border: 1px solid var(--border-lang-color);
  border-radius: 5px;
  outline: none;
  cursor: pointer;
}

.nav-right__profile-pic {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: v-bind(pfpColor);
  cursor: pointer;
}

.nav-right__profile-pic-text {
  user-select: none;
  color: var(--button-text-color);
  letter-spacing: 1px;
  font-size: 16px;
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
