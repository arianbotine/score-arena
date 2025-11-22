<template>
  <div class="app-container">
    <div class="background-gradient"></div>

    <div class="content">
      <header class="app-header">
        <div class="header-content">
          <div class="title-section">
            <h1 class="app-title">Sistema de Pontos</h1>
            <p class="app-subtitle">Múltiplos Jogadores</p>
          </div>
          <div class="header-actions">
            <GlassButton variant="danger" @click="handleResetAllData">
              🗑️ Limpar Tudo
            </GlassButton>
          </div>
        </div>
      </header>

      <!-- Toggle de visualização -->
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          <span class="toggle-icon">📋</span>
          Grade
        </button>
        <button
          class="toggle-btn"
          :class="{ active: viewMode === 'podium' }"
          @click="viewMode = 'podium'"
        >
          <span class="toggle-icon">🏆</span>
          Pódio
        </button>
      </div>

      <!-- Visualização de Pódio -->
      <div
        v-if="viewMode === 'podium' && pointsStore.players.length > 0"
        class="podium-section"
      >
        <GlassCard class="podium-card">
          <PodiumView :players="playersWithRank" />
        </GlassCard>
      </div>

      <!-- Seção de jogadores -->
      <div v-if="viewMode === 'grid'" class="players-section">
        <div class="section-header">
          <h2 class="section-title">Jogadores</h2>
          <GlassButton variant="success" @click="showAddPlayerModal = true">
            ➕ Novo Jogador
          </GlassButton>
        </div>

        <div v-if="pointsStore.players.length === 0" class="empty-players">
          <p>Nenhum jogador cadastrado. Adicione um jogador para começar!</p>
        </div>

        <div v-else class="players-grid">
          <PlayerCard
            v-for="player in playersAlphabetical"
            :key="player.id"
            :player="player"
            :isSelected="player.id === pointsStore.selectedPlayerId"
            :rank="player.rank"
            @select="handlePlayerSelect(player.id)"
            @remove="handleRemovePlayer(player.id, player.name)"
            @quickAdd="handleQuickAdd(player.id)"
            @quickSubtract="handleQuickSubtract(player.id)"
            @editName="handleEditName(player)"
          />
        </div>
      </div>

      <!-- Painel de histórico flutuante -->
      <transition name="slide-fade">
        <div
          v-if="pointsStore.history.length > 0"
          class="floating-history"
          :class="{ collapsed: historyCollapsed }"
        >
          <GlassCard class="history-card-floating">
            <div class="history-toggle-header">
              <button
                class="collapse-toggle"
                @click="historyCollapsed = !historyCollapsed"
                :title="
                  historyCollapsed
                    ? 'Expandir histórico'
                    : 'Minimizar histórico'
                "
              >
                <span class="toggle-text">📜 Histórico</span>
                <span class="toggle-icon-chevron">{{
                  historyCollapsed ? "▲" : "▼"
                }}</span>
              </button>
            </div>
            <transition name="expand">
              <div v-show="!historyCollapsed" class="history-content">
                <HistoryPanel
                  :history="pointsStore.history.slice(0, 3)"
                  @clear="pointsStore.clearHistory()"
                />
                <button
                  v-if="pointsStore.history.length > 3"
                  class="view-all-history"
                  @click="showFullHistory = true"
                >
                  Ver todo histórico ({{ pointsStore.history.length }})
                </button>
              </div>
            </transition>
          </GlassCard>
        </div>
      </transition>

      <!-- Stats footer -->
      <div class="stats-footer">
        <GlassCard class="stats-card">
          <div class="stat-item">
            <span class="stat-label">Jogadores</span>
            <span class="stat-value">{{ pointsStore.totalPlayers }}</span>
          </div>
        </GlassCard>
        <GlassCard class="stats-card">
          <div class="stat-item">
            <span class="stat-label">Total de Operações</span>
            <span class="stat-value">{{ pointsStore.totalOperations }}</span>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Modal de adicionar jogador -->
    <transition name="modal-fade">
      <div
        v-if="showAddPlayerModal"
        class="modal-overlay"
        @click.self="closeModals"
      >
        <div class="modal-card modern-modal">
          <h2 class="modal-title">
            <span class="modal-icon">👤</span>
            Novo Jogador
          </h2>

          <input
            v-model="playerName"
            type="text"
            class="modal-input modern-input"
            placeholder="Digite o nome do jogador"
            @keyup.enter="handleAddPlayer"
            ref="playerNameInput"
            maxlength="30"
          />

          <div class="modal-actions">
            <button class="modern-btn btn-cancel" @click="closeModals">
              Cancelar
            </button>
            <button class="modern-btn btn-confirm" @click="handleAddPlayer">
              <span class="btn-icon">✓</span>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de edição rápida de pontos -->
    <transition name="modal-fade">
      <div
        v-if="showQuickEditModal"
        class="modal-overlay"
        @click.self="closeModals"
      >
        <div class="modal-card quick-edit-modal">
          <h2 class="modal-title">
            <span class="modal-icon">⚡</span>
            Editar Pontos
          </h2>
          <p class="modal-subtitle">{{ editingPlayer?.name }}</p>

          <div class="quick-edit-grid">
            <button
              v-for="value in quickValues"
              :key="value"
              class="quick-value-btn"
              @click="handleQuickValue(value)"
            >
              <span class="value-sign">+</span>{{ value }}
            </button>
          </div>

          <div class="custom-value-section">
            <input
              v-model.number="inputValue"
              type="number"
              class="modal-input modern-input"
              placeholder="Valor personalizado"
              @keyup.enter="handleCustomValue"
              ref="modalInput"
            />
            <div class="value-actions">
              <button
                class="value-btn btn-subtract"
                @click="handleCustomValue('subtract')"
              >
                <span class="btn-icon">−</span> Subtrair
              </button>
              <button
                class="value-btn btn-add"
                @click="handleCustomValue('add')"
              >
                <span class="btn-icon">+</span> Adicionar
              </button>
            </div>
          </div>

          <button class="modern-btn btn-cancel" @click="closeModals">
            Fechar
          </button>
        </div>
      </div>
    </transition>

    <!-- Modal de edição de nome -->
    <transition name="modal-fade">
      <div
        v-if="showEditNameModal"
        class="modal-overlay"
        @click.self="closeModals"
      >
        <div class="modal-card modern-modal">
          <h2 class="modal-title">
            <span class="modal-icon">✏️</span>
            Editar Nome
          </h2>

          <input
            v-model="editingPlayerName"
            type="text"
            class="modal-input modern-input"
            placeholder="Digite o novo nome"
            @keyup.enter="handleSavePlayerName"
            ref="editNameInput"
            maxlength="30"
          />

          <div class="modal-actions">
            <button class="modern-btn btn-cancel" @click="closeModals">
              Cancelar
            </button>
            <button
              class="modern-btn btn-confirm"
              @click="handleSavePlayerName"
            >
              <span class="btn-icon">✓</span>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal de histórico completo -->
    <transition name="modal-fade">
      <div
        v-if="showFullHistory"
        class="modal-overlay"
        @click.self="showFullHistory = false"
      >
        <div class="modal-card history-modal">
          <h2 class="modal-title">
            <span class="modal-icon">📊</span>
            Histórico Completo
          </h2>

          <GlassCard class="full-history-container">
            <HistoryPanel
              :history="pointsStore.history"
              @clear="handleClearHistory"
            />
          </GlassCard>

          <button
            class="modern-btn btn-cancel"
            @click="showFullHistory = false"
          >
            Fechar
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { usePointsStore } from "./stores/pointsStore";
import GlassCard from "./components/GlassCard.vue";
import GlassButton from "./components/GlassButton.vue";
import PointsDisplay from "./components/PointsDisplay.vue";
import HistoryPanel from "./components/HistoryPanel.vue";
import PlayerCard from "./components/PlayerCard.vue";
import PodiumView from "./components/PodiumView.vue";

const pointsStore = usePointsStore();

const viewMode = ref("podium"); // 'grid' ou 'podium'
const showAddPlayerModal = ref(false);
const showQuickEditModal = ref(false);
const showFullHistory = ref(false);
const showEditNameModal = ref(false);
const historyCollapsed = ref(true);
const playerName = ref("");
const playerNameInput = ref(null);
const inputValue = ref(null);
const modalInput = ref(null);
const editingPlayer = ref(null);
const editingPlayerName = ref("");
const editNameInput = ref(null);

const quickValues = [1, 5, 10, 25, 50, 100];

// Calcular rankings com empates (versão realista: empate não "pula" posições)
const playersWithRank = computed(() => {
  const leaderboard = pointsStore.leaderboard;
  const result = [];
  let currentRank = 1;
  let previousPoints = null;

  leaderboard.forEach((player, index) => {
    if (previousPoints !== null && player.points !== previousPoints) {
      // Pontuação diferente, incrementa apenas 1 posição
      currentRank++;
    }
    // Se mesma pontuação, mantém o rank atual

    result.push({
      ...player,
      rank: currentRank,
    });

    previousPoints = player.points;
  });

  return result;
});

// Jogadores ordenados alfabeticamente para a grade (evita reordenação ao modificar pontos)
const playersAlphabetical = computed(() => {
  return [...playersWithRank.value].sort((a, b) => {
    return a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
  });
});

// Focar no input quando modal abre
watch(showAddPlayerModal, async () => {
  if (showAddPlayerModal.value) {
    await nextTick();
    playerNameInput.value?.focus();
  }
});

watch(showQuickEditModal, async () => {
  if (showQuickEditModal.value) {
    await nextTick();
    modalInput.value?.focus();
  }
});

watch(showEditNameModal, async () => {
  if (showEditNameModal.value) {
    await nextTick();
    editNameInput.value?.focus();
  }
});

const closeModals = () => {
  showAddPlayerModal.value = false;
  showQuickEditModal.value = false;
  showEditNameModal.value = false;
  inputValue.value = null;
  playerName.value = "";
  editingPlayer.value = null;
  editingPlayerName.value = "";
};

const handleAddPlayer = () => {
  if (!playerName.value || playerName.value.trim() === "") return;

  pointsStore.addPlayer(playerName.value);
  closeModals();
};

const handleRemovePlayer = (playerId, name) => {
  if (confirm(`Deseja remover o jogador ${name}?`)) {
    pointsStore.removePlayer(playerId);
  }
};

const handleEditName = (player) => {
  editingPlayer.value = player;
  editingPlayerName.value = player.name;
  showEditNameModal.value = true;
};

const handleSavePlayerName = () => {
  if (!editingPlayerName.value || editingPlayerName.value.trim() === "") return;
  if (!editingPlayer.value) return;

  try {
    console.debug("pointsStore available properties", Object.keys(pointsStore));
    console.debug("updatePlayerName type", typeof pointsStore.updatePlayerName);
  } catch (e) {
    console.warn("Could not introspect pointsStore", e);
  }

  if (typeof pointsStore.updatePlayerName !== "function") {
    console.error(
      "pointsStore.updatePlayerName not found or not a function",
      pointsStore
    );
    alert(
      "Erro: a função updatePlayerName não está disponível no store. Veja o console para mais detalhes."
    );
    return;
  }

  pointsStore.renamePlayer(editingPlayer.value.id, editingPlayerName.value);
  closeModals();
};

const handlePlayerSelect = (playerId) => {
  const player = pointsStore.players.find((p) => p.id === playerId);
  if (player) {
    editingPlayer.value = player;
    pointsStore.selectPlayer(playerId);
    showQuickEditModal.value = true;
  }
};

const handleQuickAdd = (playerId) => {
  pointsStore.selectPlayer(playerId);
  pointsStore.addPoints(1);

  // Feedback visual
  const element = document.querySelector(`[data-player-id="${playerId}"]`);
  if (element) {
    element.classList.add("pulse-animation");
    setTimeout(() => element.classList.remove("pulse-animation"), 600);
  }
};

const handleQuickSubtract = (playerId) => {
  pointsStore.selectPlayer(playerId);
  pointsStore.subtractPoints(1);

  // Feedback visual
  const element = document.querySelector(`[data-player-id="${playerId}"]`);
  if (element) {
    element.classList.add("pulse-animation");
    setTimeout(() => element.classList.remove("pulse-animation"), 600);
  }
};

const handleQuickValue = (value) => {
  if (!editingPlayer.value) return;

  pointsStore.selectPlayer(editingPlayer.value.id);
  pointsStore.addPoints(value);
  closeModals();
};

const handleCustomValue = (operation = "add") => {
  if (!inputValue.value || inputValue.value === 0) return;
  if (!editingPlayer.value) return;

  pointsStore.selectPlayer(editingPlayer.value.id);

  if (operation === "add") {
    pointsStore.addPoints(inputValue.value);
  } else {
    pointsStore.subtractPoints(inputValue.value);
  }

  closeModals();
};

const handleClearHistory = () => {
  if (confirm("Deseja limpar todo o histórico?")) {
    pointsStore.clearHistory();
    showFullHistory.value = false;
  }
};

const handleResetAllData = () => {
  if (
    confirm(
      "⚠️ ATENÇÃO: Esta ação irá remover TODOS os jogadores, pontos e histórico permanentemente. Deseja continuar?"
    )
  ) {
    pointsStore.clearAllData();
  }
};
</script>

<style src="./styles/components/App.css" scoped></style>
