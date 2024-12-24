<script setup lang="ts">
import SignForm from '@/components/SignForm.vue';
</script>

<template>
  <SignForm
    :sign-title="$t('signForm.signInTitle')"
    :sign-button-title="$t('signForm.signIn')"
    :new-acc="true"
  />
</template>

<style scoped></style>
