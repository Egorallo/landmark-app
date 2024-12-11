<template>
  <main class="not-found">
    <h1 class="not-found__text">This is not what you are looking for</h1>
    <router-link class="not-found__link" to="/">Go back to the main page</router-link>
  </main>
</template>

<style>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  gap: 20px;
  height: 500px;
}

.not-found__text {
  color: var(--text-main-color);
  transition: all 0.4s ease;
  font-size: 20px;
}

.not-found__link {
  color: var(--button-main-color);
  text-decoration: none;
  transition: all 0.4s ease;
}

.not-found__link:hover {
  text-decoration: underline;
}
</style>
