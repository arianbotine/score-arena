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

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.3);
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card.hover {
  cursor: pointer;
}

.glass-card.hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px 0 rgba(31, 38, 135, 0.25),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.28);
}

.glass-card.hover:active {
  transform: translateY(-2px);
}
</style>
