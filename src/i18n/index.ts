import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

let i18n: ReturnType<typeof createI18n>;

export function setupI18n(locale: string) {
  i18n = createI18n({
    locale,
    fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
    messages: { en, ru },
  });
  return i18n;
}

export function getI18n() {
  return i18n;
}
