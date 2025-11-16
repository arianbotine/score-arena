<template>
  <div class="app-container">
    <div class="background-gradient"></div>

    <div class="content">
      <header class="app-header">
        <h1 class="app-title">Sistema de Pontos</h1>
        <p class="app-subtitle">Múltiplos Jogadores</p>
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
        <div v-if="pointsStore.history.length > 0" class="floating-history">
          <GlassCard class="history-card-floating">
            <HistoryPanel
              :history="pointsStore.history.slice(0, 5)"
              @clear="pointsStore.clearHistory()"
            />
            <button
              v-if="pointsStore.history.length > 5"
              class="view-all-history"
              @click="showFullHistory = true"
            >
              Ver todo histórico ({{ pointsStore.history.length }})
            </button>
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
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(
    135deg,
    #0f0f1e 0%,
    #1a1a2e 25%,
    #16213e 50%,
    #0f3460 75%,
    #533483 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
}

.background-gradient::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(139, 92, 246, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(59, 130, 246, 0.15) 0%,
      transparent 50%
    );
  animation: float 10s ease-in-out infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.content {
  width: 100%;
  max-width: 1200px;
  z-index: 1;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
}

.app-title {
  font-size: 56px;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  text-shadow: none;
  letter-spacing: -1px;
}

.app-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* Toggle de visualização */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.toggle-btn {
  padding: 12px 24px;
  background: rgba(30, 30, 46, 0.6);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-btn:hover {
  background: rgba(30, 30, 46, 0.8);
  border-color: rgba(139, 92, 246, 0.5);
  color: white;
  transform: translateY(-2px);
}

.toggle-btn.active {
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.3) 0%,
    rgba(59, 130, 246, 0.3) 100%
  );
  border-color: rgba(139, 92, 246, 0.6);
  color: white;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
}

.toggle-icon {
  font-size: 20px;
}

/* Seção de pódio */
.podium-section {
  margin-bottom: 48px;
}

.podium-card {
  padding: 40px !important;
}

/* Seção de jogadores */
.players-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.empty-players {
  text-align: center;
  padding: 80px 32px;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 46, 0.6) 0%,
    rgba(24, 24, 37, 0.6) 100%
  );
  border-radius: 24px;
  border: 2px dashed rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(10px);
}

.empty-players p {
  margin: 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .players-grid {
    grid-template-columns: 1fr;
  }
}

.selected-player-label {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 12px;
  background: rgba(0, 122, 255, 0.2);
  border-radius: 12px;
  margin-bottom: 8px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

@media (max-width: 968px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.points-card {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.history-card {
  height: fit-content;
}

.stats-footer {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.stats-card {
  padding: 24px 48px;
  min-width: 200px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Floating history */
.floating-history {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 48px);
  z-index: 100;
}

.history-card-floating {
  padding: 20px !important;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 46, 0.95) 0%,
    rgba(24, 24, 37, 0.98) 100%
  ) !important;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4) !important;
}

.view-all-history {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-history:hover {
  background: rgba(139, 92, 246, 0.3);
  border-color: rgba(139, 92, 246, 0.5);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 46, 0.95) 0%,
    rgba(24, 24, 37, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5);
  max-width: 90vw;
}

.modern-modal {
  min-width: 400px;
}

.quick-edit-modal {
  min-width: 450px;
}

.history-modal {
  min-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .modern-modal,
  .quick-edit-modal,
  .history-modal {
    min-width: 100%;
  }
}

.modal-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.modal-icon {
  font-size: 32px;
}

.modal-subtitle {
  text-align: center;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px 0;
  font-weight: 500;
}

.modal-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: white;
  font-size: 18px;
  text-align: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.modern-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.modal-input::-webkit-inner-spin-button,
.modal-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.modal-input[type="number"] {
  -moz-appearance: textfield;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modern-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.quick-edit-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.quick-value-btn {
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.2) 0%,
    rgba(59, 130, 246, 0.2) 100%
  );
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 16px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-value-btn:hover {
  transform: scale(1.05);
  border-color: rgba(139, 92, 246, 0.6);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
}

.quick-value-btn:active {
  transform: scale(0.98);
}

.value-sign {
  font-size: 20px;
  margin-right: 4px;
  opacity: 0.7;
}

.custom-value-section {
  margin-bottom: 24px;
}

.value-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 12px;
}

.value-btn {
  padding: 14px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-subtract {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-subtract:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
}

.btn-add {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.full-history-container {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 20px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .modal-card,
.modal-fade-leave-active .modal-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-card,
.modal-fade-leave-to .modal-card {
  transform: scale(0.9) translateY(20px);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-animation {
  animation: pulse 0.6s ease;
}
</style>
