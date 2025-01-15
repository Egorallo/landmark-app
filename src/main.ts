import './assets/base.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { setupI18n } from '@/i18n';
import { useLocaleStore } from '@/stores/locale';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());

const localeStore = useLocaleStore();

const i18n = setupI18n(localeStore.locale);

app.use(router);
app.use(i18n);

app.mount('#app');
