<template>
  <div class="podium-container">
    <div class="podium-title">
      <h2>🏆 Pódio</h2>
    </div>

    <div v-if="props.players.length === 0" class="no-podium">
      <p>Adicione jogadores para ver o pódio</p>
    </div>

    <div v-else class="podium-scene">
      <!-- 2º Lugar (Esquerda) -->
      <div
        v-if="secondPlaceGroup.length > 0"
        class="podium-position position-2"
        :class="{ 'has-tie': secondPlaceGroup.length > 1 }"
        :style="{ '--grid-size': getGridSize(secondPlaceGroup.length) }"
      >
        <div class="players-group">
          <div
            v-for="player in secondPlaceGroup"
            :key="player.id"
            class="player-in-group"
          >
            <div class="player-avatar silver">
              <span class="avatar-initial">{{ getInitial(player.name) }}</span>
            </div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-points">{{ formatPoints(player.points) }}</div>
          </div>
        </div>
        <div class="podium-block silver-block">
          <div class="medal-icon">🥈</div>
          <div class="position-number">2º</div>
        </div>
      </div>

      <!-- 1º Lugar (Centro - Mais Alto) -->
      <div
        v-if="firstPlaceGroup.length > 0"
        class="podium-position position-1"
        :class="{ 'has-tie': firstPlaceGroup.length > 1 }"
        :style="{ '--grid-size': getGridSize(firstPlaceGroup.length) }"
      >
        <div class="crown">👑</div>
        <div class="players-group">
          <div
            v-for="player in firstPlaceGroup"
            :key="player.id"
            class="player-in-group"
          >
            <div class="player-avatar gold">
              <span class="avatar-initial">{{ getInitial(player.name) }}</span>
            </div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-points">{{ formatPoints(player.points) }}</div>
          </div>
        </div>
        <div class="podium-block gold-block">
          <div class="medal-icon">🥇</div>
          <div class="position-number">1º</div>
        </div>
      </div>

      <!-- 3º Lugar (Direita) -->
      <div
        v-if="thirdPlaceGroup.length > 0"
        class="podium-position position-3"
        :class="{ 'has-tie': thirdPlaceGroup.length > 1 }"
        :style="{ '--grid-size': getGridSize(thirdPlaceGroup.length) }"
      >
        <div class="players-group">
          <div
            v-for="player in thirdPlaceGroup"
            :key="player.id"
            class="player-in-group"
          >
            <div class="player-avatar bronze">
              <span class="avatar-initial">{{ getInitial(player.name) }}</span>
            </div>
            <div class="player-name">{{ player.name }}</div>
            <div class="player-points">{{ formatPoints(player.points) }}</div>
          </div>
        </div>
        <div class="podium-block bronze-block">
          <div class="medal-icon">🥉</div>
          <div class="position-number">3º</div>
        </div>
      </div>
    </div>

    <!-- Demais jogadores -->
    <div v-if="otherPlayers.length > 0" class="other-players">
      <h3 class="other-players-title">Outros Jogadores</h3>
      <div class="other-players-list">
        <div
          v-for="player in otherPlayers"
          :key="player.id"
          class="other-player-item"
        >
          <div class="other-rank">{{ player.rank }}º</div>
          <div class="other-avatar">
            <span>{{ getInitial(player.name) }}</span>
          </div>
          <div class="other-info">
            <div class="other-name">{{ player.name }}</div>
            <div class="other-points">
              {{ formatPoints(player.points) }} pts
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  players: {
    type: Array,
    required: true,
  },
});

const getInitial = (name) => {
  return name.charAt(0).toUpperCase();
};

const formatPoints = (points) => {
  return points.toLocaleString("pt-BR");
};

// Agrupar jogadores por posição (1º, 2º, 3º)
const firstPlaceGroup = computed(() => {
  return props.players.filter((p) => p.rank === 1);
});

const secondPlaceGroup = computed(() => {
  return props.players.filter((p) => p.rank === 2);
});

const thirdPlaceGroup = computed(() => {
  return props.players.filter((p) => p.rank === 3);
});

// Jogadores que não estão no pódio (posição > 3)
const otherPlayers = computed(() => {
  return props.players
    .filter((p) => p.rank > 3)
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.points - a.points;
    });
});

// Calcula o tamanho da grade quadrada baseado no número de jogadores
const getGridSize = (numPlayers) => {
  if (numPlayers === 1) return 1;
  // Encontra o menor n onde 2^n >= numPlayers
  return Math.ceil(Math.sqrt(numPlayers));
};
</script>

<style src="../styles/components/PodiumView.css" scoped></style>
