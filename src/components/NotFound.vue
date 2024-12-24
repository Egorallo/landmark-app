<template>
  <main class="not-found flex-center">
    <h1 class="not-found__text">{{ $t('notFound.header') }}</h1>
    <router-link class="not-found__link" to="/">{{ $t('notFound.link') }}</router-link>
  </main>
</template>

<style>
.not-found {
  flex-direction: column;
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
