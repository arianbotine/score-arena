<template>
  <div class="history-panel">
    <div class="history-header">
      <h3>Histórico</h3>
      <button
        v-if="history.length > 0"
        class="clear-button"
        @click="$emit('clear')"
        title="Limpar histórico"
      >
        ✕
      </button>
    </div>

    <div v-if="history.length === 0" class="empty-state">
      Nenhuma operação realizada
    </div>

    <div v-else class="history-list">
      <div v-for="entry in history" :key="entry.id" class="history-item">
        <div class="history-operation">
          <span class="operation-badge" :class="entry.operation">
            {{ formatOperation(entry) }}
          </span>
        </div>
        <div class="history-details">
          <span class="player-name-history">{{ entry.playerName }}</span>
          <span class="points-change" v-if="!entry.customMessage">
            {{ entry.previousPoints }} → {{ entry.newPoints }}
          </span>
          <span class="custom-message" v-else>
            {{ entry.customMessage }}
          </span>
          <span class="history-time">
            {{ formatTime(entry.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  history: {
    type: Array,
    required: true,
  },
});

defineEmits(["clear"]);

const formatOperation = (entry) => {
  switch (entry.operation) {
    case "add":
      return `+${entry.value}`;
    case "subtract":
      return `-${entry.value}`;
    case "multiply":
      return `×${entry.value}`;
    case "set":
      return `=${entry.value}`;
    case "reset":
      return "Reset";
    default:
      return entry.operation;
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.history-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.clear-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: rgba(255, 59, 48, 0.3);
  border-color: rgba(255, 59, 48, 0.5);
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.2s ease;
  animation: slideInHistory 0.3s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.08);
}

@keyframes slideInHistory {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.history-operation {
  display: flex;
  align-items: center;
}

.operation-badge {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.operation-badge.add {
  background: rgba(52, 199, 89, 0.3);
}

.operation-badge.subtract {
  background: rgba(255, 59, 48, 0.3);
}

.operation-badge.multiply {
  background: rgba(255, 149, 0, 0.3);
}

.operation-badge.reset {
  background: rgba(142, 142, 147, 0.3);
}

.operation-badge.player_added {
  background: rgba(52, 199, 89, 0.3);
}

.operation-badge.player_removed {
  background: rgba(255, 59, 48, 0.3);
}

.history-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.player-name-history {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.points-change {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
}

.custom-message {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.history-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
