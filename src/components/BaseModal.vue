<script setup lang="ts">
import BaseButton from './BaseButton.vue';
import { computed } from 'vue';

interface Props {
  isOpen: boolean;
  buttonStyle?: string;
  buttonDsiabled?: boolean;
  buttonText: string;
  buttonDisabled?: boolean;
  modalWidth?: string;
}

const props = defineProps<Props>();

const modalWidthClass = computed(() => `${props.modalWidth || ''}`);

const emit = defineEmits(['modal-close', 'submit']);

function handleSubmitAndClose() {
  emit('submit');
  emit('modal-close');
}
</script>

<template>
  <Teleport to="#app">
    <div class="modal-mask" @click="emit('modal-close')">
      <div class="modal-wrapper" v-if="isOpen">
        <div @click.stop class="modal-container" :class="modalWidthClass">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="content"></slot>
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
  </Teleport>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  position: relative;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 50px auto;
  padding: 20px 30px;
  background-color: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  overflow-y: auto;
}

@media (max-width: 750px) {
  .modal-container {
    width: 90%;
  }
}
</style>
