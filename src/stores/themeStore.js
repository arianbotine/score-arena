import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const themes = {
  cosmic: {
    name: "Cósmico",
    icon: "🌌",
    description: "Profundo e misterioso",
    gradient: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)",
    primary: "#8b5cf6",
    secondary: "#3b82f6",
    accent: "#a78bfa",
    cardBg: "rgba(30, 30, 46, 0.6)",
    cardBgHover: "rgba(30, 30, 46, 0.8)",
    glowColor: "rgba(139, 92, 246, 0.4)",
  },
  sunset: {
    name: "Pôr do Sol",
    icon: "🌅",
    description: "Quente e acolhedor",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 25%, #3d1b3d 50%, #4a1942 75%, #ff6b6b 100%)",
    primary: "#ff6b6b",
    secondary: "#feca57",
    accent: "#ff9ff3",
    cardBg: "rgba(77, 25, 66, 0.6)",
    cardBgHover: "rgba(77, 25, 66, 0.8)",
    glowColor: "rgba(255, 107, 107, 0.4)",
  },
  ocean: {
    name: "Oceano",
    icon: "🌊",
    description: "Calmo e refrescante",
    gradient: "linear-gradient(135deg, #0a1128 0%, #001f54 25%, #034078 50%, #1282a2 75%, #0a1128 100%)",
    primary: "#1282a2",
    secondary: "#00d4ff",
    accent: "#4dd0e1",
    cardBg: "rgba(3, 64, 120, 0.6)",
    cardBgHover: "rgba(3, 64, 120, 0.8)",
    glowColor: "rgba(18, 130, 162, 0.4)",
  },
  forest: {
    name: "Floresta",
    icon: "🌲",
    description: "Natural e relaxante",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 25%, #2d4a3e 50%, #3d5a4c 75%, #52796f 100%)",
    primary: "#52796f",
    secondary: "#84a98c",
    accent: "#cad2c5",
    cardBg: "rgba(45, 74, 62, 0.6)",
    cardBgHover: "rgba(45, 74, 62, 0.8)",
    glowColor: "rgba(82, 121, 111, 0.4)",
  },
  neon: {
    name: "Neon",
    icon: "⚡",
    description: "Vibrante e energético",
    gradient: "linear-gradient(135deg, #0a0e27 0%, #1a1a2e 25%, #16213e 50%, #240046 75%, #3c096c 100%)",
    primary: "#ff006e",
    secondary: "#00f5ff",
    accent: "#ffbe0b",
    cardBg: "rgba(60, 9, 108, 0.6)",
    cardBgHover: "rgba(60, 9, 108, 0.8)",
    glowColor: "rgba(255, 0, 110, 0.4)",
  },
  lavender: {
    name: "Lavanda",
    icon: "🌸",
    description: "Suave e elegante",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2640 25%, #403d58 50%, #8b7e99 75%, #c8b8db 100%)",
    primary: "#b8a9d4",
    secondary: "#e0b1cb",
    accent: "#f5cac3",
    cardBg: "rgba(64, 61, 88, 0.6)",
    cardBgHover: "rgba(64, 61, 88, 0.8)",
    glowColor: "rgba(184, 169, 212, 0.4)",
  },
  aurora: {
    name: "Aurora",
    icon: "✨",
    description: "Mágico e inspirador",
    gradient: "linear-gradient(135deg, #0f0f1e 0%, #1e1b3c 25%, #2d2654 50%, #3d316b 75%, #6a4c93 100%)",
    primary: "#6a4c93",
    secondary: "#1ac8ed",
    accent: "#f72585",
    cardBg: "rgba(45, 38, 84, 0.6)",
    cardBgHover: "rgba(45, 38, 84, 0.8)",
    glowColor: "rgba(106, 76, 147, 0.4)",
  },
  mint: {
    name: "Menta",
    icon: "🍃",
    description: "Fresco e limpo",
    gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b3a4b 25%, #2e5266 50%, #48a9a6 75%, #76c893 100%)",
    primary: "#48a9a6",
    secondary: "#76c893",
    accent: "#c1fba4",
    cardBg: "rgba(46, 82, 102, 0.6)",
    cardBgHover: "rgba(46, 82, 102, 0.8)",
    glowColor: "rgba(72, 169, 166, 0.4)",
  },
  candy: {
    name: "Doce",
    icon: "🍬",
    description: "Doce e divertido",
    gradient: "linear-gradient(135deg, #2b1b35 0%, #3d2c4d 25%, #5e3d66 50%, #d6729c 75%, #ffc2d4 100%)",
    primary: "#ff6fb5",
    secondary: "#ffb8d1",
    accent: "#ffd6e8",
    cardBg: "rgba(94, 61, 102, 0.6)",
    cardBgHover: "rgba(94, 61, 102, 0.8)",
    glowColor: "rgba(255, 111, 181, 0.4)",
  },
  midnight: {
    name: "Meia-Noite",
    icon: "🌙",
    description: "Misterioso e sofisticado",
    gradient: "linear-gradient(135deg, #000000 0%, #0d1117 25%, #161b22 50%, #21262d 75%, #30363d 100%)",
    primary: "#58a6ff",
    secondary: "#79c0ff",
    accent: "#a5d6ff",
    cardBg: "rgba(33, 38, 45, 0.6)",
    cardBgHover: "rgba(33, 38, 45, 0.8)",
    glowColor: "rgba(88, 166, 255, 0.4)",
  },
};

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref("cosmic");

  // Carregar tema do localStorage
  const loadTheme = () => {
    try {
      const saved = localStorage.getItem("app-theme");
      if (saved && themes[saved]) {
        currentTheme.value = saved;
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  // Salvar tema no localStorage
  const saveTheme = () => {
    try {
      localStorage.setItem("app-theme", currentTheme.value);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  // Aplicar tema ao documento
  const applyTheme = (themeName) => {
    if (!themes[themeName]) return;

    const theme = themes[themeName];
    const root = document.documentElement;

    // Aplicar variáveis CSS
    root.style.setProperty("--theme-gradient", theme.gradient);
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-card-bg", theme.cardBg);
    root.style.setProperty("--theme-card-bg-hover", theme.cardBgHover);
    root.style.setProperty("--theme-glow", theme.glowColor);

    currentTheme.value = themeName;
    saveTheme();
  };

  // Observar mudanças no tema
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme);
  });

  // Inicializar
  loadTheme();
  applyTheme(currentTheme.value);

  return {
    currentTheme,
    themes,
    applyTheme,
  };
});
