<script setup lang="ts"></script>

<template>
  <main class="sign-form">
    <section class="sign-form__container">
      <h1 class="sign-form__title sign-form__title_text">{{ signTitle }}</h1>
      <form class="sign-form__form" @submit.prevent="signInAcc">
        <input class="sign-form__input" v-model="email" placeholder="Email" autocomplete="email" />
        <input
          class="sign-form__input"
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="password"
        />
        <template v-if="newAcc">
          <input
            class="sign-form__input"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            autocomplete="confirm-password"
          />
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
.sign-form {
  max-width: 400px;
  width: 100%;
  margin: 200px auto 0;
}

.sign-form__title_text {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-main-color);
  transition: all 0.4s ease;
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
  transition: all 0.4s ease;
}

.sign-form__input::placeholder {
  color: var(--text-secondary-color);
  transition: all 0.4s ease;
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
  transition: all 0.4s ease;
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
