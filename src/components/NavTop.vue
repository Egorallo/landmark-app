<script setup lang="ts">
import { signOut } from '@/services/authService';
import IconSignOut from './icons/IconSignOut.vue';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { getCurrentUser } from '@/services/authService';
import { generateHexColor } from '@/utils/radnomHexColor';
import BaseButton from '@/components/BaseButton.vue';
import { useLocaleStore } from '@/stores/locale';
import { getI18n } from '@/i18n';
const localeStore = useLocaleStore();

const router = useRouter();
const userEmail = ref('');
const pfpColor = ref('white');
const showSignOut = ref(false);
const profilePicRef = ref<HTMLElement | null>(null);

const userPfp = computed(() => (userEmail.value || '').slice(0, 2));

async function handleSignOut() {
  await signOut();
  router.push('/sign-in');
}

function handleClickOutside(event: MouseEvent) {
  if (profilePicRef.value && !profilePicRef.value.contains(event.target as Node)) {
    showSignOut.value = false;
  }
}

function changePfpColor() {
  showSignOut.value = !showSignOut.value;
  pfpColor.value = generateHexColor();
}

function changeLocale() {
  if (getI18n().global.locale === 'en') {
    getI18n().global.locale = 'ru';
    localeStore.setLocale('ru');
  } else {
    getI18n().global.locale = 'en';
    localeStore.setLocale('en');
  }
}

onMounted(async () => {
  const user = await getCurrentUser();
  userEmail.value = user?.email || '';
  window.addEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="nav">
    <div class="nav-left">Landmarks 2025 📍</div>
    <div class="nav-right">
      <BaseButton :custom-styles="'custom-btn-locale'" @click="changeLocale">{{
        $i18n.locale.toUpperCase()
      }}</BaseButton>
      <div class="nav-right__profile-pic flex-center" ref="profilePicRef" @click="changePfpColor">
        <div class="nav-right__profile-pic-text">{{ userPfp }}</div>
        <div class="nav-right__sign-out" v-show="showSignOut">
          <BaseButton :custom-styles="'custom-btn-sign-out'" @click="handleSignOut">
            <div class="slot-content">
              <IconSignOut
                :color="'var(--color-icon)'"
                :width="'20px'"
                :height="'20px'"
              ></IconSignOut>
              <span class="span-aboba">Sign Out</span>
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.slot-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
}
.span-aboba {
  color: var(--text-main-color);
}
.nav-right__sign-out {
  width: 120px;
  position: absolute;
  display: flex;
  background-color: var(--bg-color-sign-out);
  bottom: -40px;
  left: -90px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.4s ease;
}

.nav-right__sign-out:hover {
  background-color: var(--bg-color-sign-out-hover);
}

.custom-btn-sign-out {
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 0;
  cursor: pointer;
  user-select: none;
  transition: all 0.4s ease;
}

.custom-btn-sign-out:hover {
  background-color: transparent;
}

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
  width: 100px;
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
  position: relative;
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
