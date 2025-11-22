<template>
  <div class="player-card" :class="{ selected: isSelected }">
    <div class="player-header">
      <div class="rank-badge" v-if="rank">
        <span class="rank-number">{{ rank }}</span>
        <span class="rank-icon">{{ getRankIcon(rank) }}</span>
      </div>

      <button
        class="remove-button"
        @click.stop="$emit('remove')"
        title="Remover jogador"
      >
        ✕
      </button>
    </div>

    <div class="player-info">
      <h3
        class="player-name"
        @click="$emit('editName')"
        title="Clique para editar o nome"
      >
        {{ player.name }}
        <span class="edit-icon">✏️</span>
      </h3>
      <div class="player-points">
        {{ formattedPoints }}
      </div>
    </div>

    <div class="quick-actions">
      <button
        class="quick-btn quick-btn-subtract"
        @click.stop="$emit('quickSubtract')"
        title="Subtrair 1 ponto"
      >
        <span class="btn-icon">−</span>
      </button>

      <button
        class="quick-btn quick-btn-custom"
        @click.stop="$emit('select')"
        title="Editar pontos"
      >
        <span class="btn-icon">✏️</span>
      </button>

      <button
        class="quick-btn quick-btn-add"
        @click.stop="$emit('quickAdd')"
        title="Adicionar 1 ponto"
      >
        <span class="btn-icon">+</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  rank: {
    type: Number,
    default: null,
  },
});

defineEmits(["select", "remove", "quickAdd", "quickSubtract", "editName"]);

const getRankIcon = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "👤";
};

const formattedPoints = computed(() => {
  return props.player.points.toLocaleString("pt-BR");
});
</script>

<style src="../styles/components/PlayerCard.css" scoped></style>
