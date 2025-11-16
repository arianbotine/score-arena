<template>
  <button
    class="glass-button"
    :class="[variant, { disabled: disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: "primary",
    validator: (value) =>
      ["primary", "success", "danger", "secondary"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>

<style scoped>
.glass-button {
  position: relative;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px) saturate(180%);
  -webkit-backdrop-filter: blur(10px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 16px 32px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.2),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.glass-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.glass-button:hover::before {
  opacity: 1;
}

.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px 0 rgba(31, 38, 135, 0.3),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.glass-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.2);
}

.button-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Variantes de cor */
.glass-button.primary {
  background: rgba(0, 122, 255, 0.25);
}

.glass-button.success {
  background: rgba(52, 199, 89, 0.25);
}

.glass-button.danger {
  background: rgba(255, 59, 48, 0.25);
}

.glass-button.secondary {
  background: rgba(142, 142, 147, 0.25);
}

/* Estado desabilitado */
.glass-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
