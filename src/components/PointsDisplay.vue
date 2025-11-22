<template>
  <div class="points-display">
    <div class="points-label">Pontos</div>
    <div class="points-value" :key="displayPoints">
      {{ displayPoints }}
    </div>
    <div v-if="lastOperation" class="last-operation">
      {{ formatLastOperation }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  points: {
    type: Number,
    required: true,
  },
  lastOperation: {
    type: Object,
    default: null,
  },
});

const displayPoints = computed(() => {
  return props.points.toLocaleString("pt-BR");
});

const formatLastOperation = computed(() => {
  if (!props.lastOperation) return "";

  const { operation, value } = props.lastOperation;

  switch (operation) {
    case "add":
      return `+${value}`;
    case "subtract":
      return `-${value}`;
    case "multiply":
      return `×${value}`;
    case "reset":
      return "Reset";
    default:
      return "";
  }
});
</script>

<style src="../styles/components/PointsDisplay.css" scoped></style>
