import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<string>(localStorage.getItem('locale') || import.meta.env.VITE_DEFAULT_LOCALE);

  watch(locale, (newLocale) => {
    localStorage.setItem('locale', newLocale);
  });

  const setLocale = (newLocale: string) => {
    locale.value = newLocale;
  };

  return { locale, setLocale };
});
