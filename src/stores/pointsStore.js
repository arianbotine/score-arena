import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const usePointsStore = defineStore("points", () => {
  // Estado reativo
  const players = ref([]);
  const selectedPlayerId = ref(null);
  const history = ref([]);
  const maxHistory = 50;

  // Carregar dados do localStorage ao inicializar
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem("points-system");
      if (saved) {
        const data = JSON.parse(saved);
        players.value = data.players || [];
        selectedPlayerId.value = data.selectedPlayerId || null;
        history.value = data.history || [];
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // Salvar no localStorage automaticamente
  const saveToStorage = () => {
    try {
      const data = {
        players: players.value,
        selectedPlayerId: selectedPlayerId.value,
        history: history.value,
      };
      localStorage.setItem("points-system", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
    }
  };

  // Observar mudanças e salvar automaticamente
  watch(
    [players, selectedPlayerId, history],
    () => {
      saveToStorage();
    },
    { deep: true }
  );

  // Adicionar jogador
  const addPlayer = (name) => {
    const player = {
      id: Date.now(),
      name: name.trim(),
      points: 0,
      createdAt: new Date().toISOString(),
    };
    players.value.push(player);

    // Selecionar automaticamente se for o primeiro
    if (players.value.length === 1) {
      selectedPlayerId.value = player.id;
    }

    addToHistory("player_added", 0, 0, player.id, `Jogador ${name} adicionado`);
    return player;
  };

  // Remover jogador
  const removePlayer = (playerId) => {
    const player = players.value.find((p) => p.id === playerId);
    if (!player) return;

    players.value = players.value.filter((p) => p.id !== playerId);

    // Se o jogador removido estava selecionado, selecionar outro
    if (selectedPlayerId.value === playerId) {
      selectedPlayerId.value =
        players.value.length > 0 ? players.value[0].id : null;
    }

    addToHistory(
      "player_removed",
      0,
      0,
      playerId,
      `Jogador ${player.name} removido`
    );
  };

  // Editar nome do jogador
  const updatePlayerName = (playerId, newName) => {
    const player = players.value.find((p) => p.id === playerId);
    if (!player) return;

    const oldName = player.name;
    player.name = newName.trim();

    addToHistory(
      "player_renamed",
      0,
      0,
      playerId,
      `Jogador renomeado: ${oldName} → ${newName}`
    );
  };

  // Renomear jogador (wraps updatePlayerName, fallback to direct update if needed)
  const renamePlayer = (playerId, newName) => {
    if (typeof updatePlayerName === "function") {
      updatePlayerName(playerId, newName);
      return;
    }

    // Fallback: update directly if action not available
    const player = players.value.find((p) => p.id === playerId);
    if (!player) return;
    const oldName = player.name;
    player.name = newName.trim();
    addToHistory(
      "player_renamed",
      0,
      0,
      playerId,
      `Jogador renomeado: ${oldName} → ${newName}`
    );
  };

  // Selecionar jogador
  const selectPlayer = (playerId) => {
    if (players.value.find((p) => p.id === playerId)) {
      selectedPlayerId.value = playerId;
    }
  };

  // Pegar jogador selecionado
  const selectedPlayer = computed(() => {
    return players.value.find((p) => p.id === selectedPlayerId.value) || null;
  });

  // Adicionar entrada ao histórico
  const addToHistory = (
    operation,
    value,
    previousPoints,
    playerId,
    customMessage = null
  ) => {
    const player = players.value.find((p) => p.id === playerId);
    const entry = {
      id: Date.now() + Math.random(), // Garantir unicidade
      timestamp: new Date().toISOString(),
      operation,
      value,
      previousPoints,
      newPoints: player ? player.points : 0,
      playerId,
      playerName: player ? player.name : "Desconhecido",
      customMessage,
    };

    history.value.unshift(entry);

    // Limitar tamanho do histórico
    if (history.value.length > maxHistory) {
      history.value = history.value.slice(0, maxHistory);
    }
  };

  // Operações de pontos no jogador selecionado
  const addPoints = (value) => {
    if (!selectedPlayer.value) return;

    const previous = selectedPlayer.value.points;
    selectedPlayer.value.points += value;
    addToHistory("add", value, previous, selectedPlayer.value.id);
  };

  const subtractPoints = (value) => {
    if (!selectedPlayer.value) return;

    const previous = selectedPlayer.value.points;
    selectedPlayer.value.points -= value;
    addToHistory("subtract", value, previous, selectedPlayer.value.id);
  };

  const multiplyPoints = (multiplier) => {
    if (!selectedPlayer.value) return;

    const previous = selectedPlayer.value.points;
    selectedPlayer.value.points *= multiplier;
    addToHistory("multiply", multiplier, previous, selectedPlayer.value.id);
  };

  const setPoints = (value, playerId = null) => {
    const targetPlayerId = playerId || selectedPlayerId.value;
    const player = players.value.find((p) => p.id === targetPlayerId);
    if (!player) return;

    const previous = player.points;
    player.points = value;
    addToHistory("set", value, previous, targetPlayerId);
  };

  const resetPoints = (playerId = null) => {
    const targetPlayerId = playerId || selectedPlayerId.value;
    const player = players.value.find((p) => p.id === targetPlayerId);
    if (!player) return;

    const previous = player.points;
    player.points = 0;
    addToHistory("reset", 0, previous, targetPlayerId);
  };

  const resetAllPlayers = () => {
    players.value.forEach((player) => {
      const previous = player.points;
      player.points = 0;
      addToHistory("reset", 0, previous, player.id);
    });
  };

  const clearHistory = () => {
    history.value = [];
  };

  const clearAllData = () => {
    players.value = [];
    selectedPlayerId.value = null;
    history.value = [];
  };

  // Computeds
  const totalOperations = computed(() => history.value.length);
  const lastOperation = computed(() => history.value[0] || null);
  const totalPlayers = computed(() => players.value.length);
  const leaderboard = computed(() => {
    return [...players.value].sort((a, b) => b.points - a.points);
  });

  // Formatação de operações para display
  const formatOperation = (operation, value) => {
    switch (operation) {
      case "add":
        return `+${value}`;
      case "subtract":
        return `-${value}`;
      case "multiply":
        return `×${value}`;
      case "set":
        return `=${value}`;
      case "reset":
        return "Reset";
      case "player_added":
        return "➕ Novo";
      case "player_removed":
        return "❌ Removido";
      default:
        return operation;
    }
  };

  // Inicializar ao criar a store
  loadFromStorage();

  return {
    // Estado
    players,
    selectedPlayerId,
    history,

    // Computeds
    selectedPlayer,
    totalOperations,
    lastOperation,
    totalPlayers,
    leaderboard,

    // Ações
    addPlayer,
    removePlayer,
    updatePlayerName,
    renamePlayer,
    selectPlayer,
    addPoints,
    subtractPoints,
    multiplyPoints,
    setPoints,
    resetPoints,
    resetAllPlayers,
    clearHistory,
    clearAllData,
    formatOperation,
  };
});
