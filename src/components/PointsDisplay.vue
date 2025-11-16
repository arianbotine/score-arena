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

<style scoped>
.points-display {
  text-align: center;
  padding: 24px;
}

.points-label {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.points-value {
  font-size: 72px;
  font-weight: 700;
  color: white;
  line-height: 1;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.last-operation {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  animation: fadeIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
