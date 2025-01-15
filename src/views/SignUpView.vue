<script setup lang="ts">
import SignForm from '@/components/SignForm.vue';
</script>

<template>
  <SignForm
    :sign-title="$t('signForm.signUpTitle')"
    :sign-button-title="$t('signForm.signUp')"
    :new-acc="false"
  />
</template>

<style scoped></style>
