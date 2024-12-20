<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToastsStore } from '@/stores/toasts';
import { signIn, signUp } from '../services/authService';

interface Props {
  signTitle: string;
  signButtonTitle: string;
  newAcc: boolean;
}

defineProps<Props>();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref<string | null>(null);
const signmessage = ref('');

const router = useRouter();
const route = useRoute();
const toastsStore = useToastsStore();

const signInAcc = async () => {
  error.value = null;

  if (route.path === '/sign-up' && password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.';
    return;
  }

  if (route.path === '/sign-in') {
    signmessage.value = 'Signing you in...';
    const result = await signIn(email.value, password.value);

    if ('failed' in result) {
      signmessage.value = '';
      toastsStore.addToast(result.message);
      return;
    }

    router.push('/');
  } else {
    signmessage.value = 'Creating your account...';
    const result = await signUp(email.value, password.value);

    if ('failed' in result) {
      signmessage.value = '';
      toastsStore.addToast(result.message);
      return;
    }

    router.push('/');
  }
};
</script>

<template>
  <main class="sign-form__main">
    <section class="sign-form__container">
      <h1 class="sign-form__title sign-form__title_text">{{ signTitle }}</h1>
      <form class="sign-form__form" @submit.prevent="signInAcc">
        <div class="sign-form email">
          <label for="email" class="sign-form__label">Email</label>
          <input
            id="email"
            class="sign-form__input"
            v-model="email"
            placeholder="Your email"
            autocomplete="email"
          />
        </div>
        <div class="sign-form password">
          <label for="password" class="sign-form__label">Password</label>
          <input
            id="password"
            class="sign-form__input"
            v-model="password"
            type="password"
            placeholder="Your password"
            autocomplete="password"
          />
        </div>

        <template v-if="!newAcc">
          <div class="sign-form confirm-password">
            <label for="confirm-password" class="sign-form__label">Confirm Password</label>
            <input
              id="confirm-password"
              class="sign-form__input"
              v-model="confirmPassword"
              type="password"
              placeholder="Reenter the password"
              autocomplete="confirm-password"
            />
          </div>
        </template>

        <button class="sign-form__button" type="submit">{{ signButtonTitle }}</button>
      </form>
      <div class="error" v-if="error">
        <span>{{ error }}</span>
      </div>
      <div class="sign-message" v-if="signmessage">
        <span>{{ signmessage }}</span>
      </div>
      <div class="sign-form__other">
        <div v-if="newAcc">
          <p>
            Don't have an account?
            <RouterLink to="/sign-up" class="sign-form__link">Sign Up</RouterLink>
          </p>
        </div>
        <div v-else>
          <p>
            Already have an account?
            <RouterLink to="/sign-in" class="sign-form__link">Sign In</RouterLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.sign-form__main {
  max-width: 400px;
  width: 100%;
  margin: 200px auto 0;
}

.sign-form {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}

.sign-form__title_text {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-main-color);
}

.sign-form__container {
  margin: 0 auto 0;
  display: flex;
  max-width: 320px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 15px;
}

.sign-form__form {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.sign-form__input {
  font-family: 'Mulish', serif;
  max-width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: var(--bg-color-form);
  color: var(--text-main-color);
  outline: none;
}

.sign-form__input::placeholder {
  color: var(--text-secondary-color);
}

.sign-form__button {
  font-family: 'Mulish', serif;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: var(--button-main-color);
  color: var(--button-text-color);
  cursor: pointer;
  transition: all 0.4s ease;
}

.sign-form__button:hover {
  background-color: var(--button-main-color-hover);
}

.sign-form__other {
  color: var(--text-main-color);
}

.sign-form__link {
  color: var(--button-main-color);
  cursor: pointer;
  text-decoration: none;
}
.sign-form__link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 17px;
}

.sign-message {
  color: green;
  font-size: 17px;
}
</style>
