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

<style src="../styles/components/GlassButton.css" scoped></style>
