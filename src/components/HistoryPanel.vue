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

<style src="../styles/components/HistoryPanel.css" scoped></style>
