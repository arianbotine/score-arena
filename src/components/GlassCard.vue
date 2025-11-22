<template>
  <div class="glass-card" :class="{ hover: hover }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  hover: {
    type: Boolean,
    default: false,
  },
});
</script>

<style src="../styles/components/GlassCard.css" scoped></style>
