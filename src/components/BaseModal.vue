<script setup lang="ts">
import BaseButton from './BaseButton.vue';

interface Props {
  isOpen: boolean;
  buttonStyle?: string;
  buttonDsiabled?: boolean;
  buttonText: string;
  buttonDisabled?: boolean;
}

defineProps<Props>();

const emit = defineEmits(['modal-close', 'submit']);

function handleSubmitAndClose() {
  emit('submit');
  emit('modal-close');
}
</script>

<template>
  <div v-if="isOpen" class="modal-mask" @click="emit('modal-close')">
    <div class="modal-wrapper">
      <div @click.stop class="modal-container">
        <div class="modal-header">
          <slot name="header"> default header </slot>
        </div>
        <div class="modal-body">
          <slot name="content"> default content </slot>
        </div>
        <div class="modal-footer">
          <slot name="footer">
            <div>
              <BaseButton
                :custom-styles="buttonStyle"
                :disabled="buttonDisabled"
                @click="handleSubmitAndClose"
                >{{ buttonText }}</BaseButton
              >
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  max-width: 450px;
  margin: 50px auto;
  padding: 20px 30px;
  background-color: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

@media (max-width: 750px) {
  .modal-container {
    width: 90%;
  }
}
</style>
