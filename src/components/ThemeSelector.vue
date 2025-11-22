<template>
  <div class="theme-selector-container">
    <button class="theme-toggle-btn" @click="isOpen = !isOpen" :title="'Tema: ' + themes[themeStore.currentTheme].name">
      <span class="theme-icon">{{ themes[themeStore.currentTheme].icon }}</span>
    </button>

    <transition name="theme-panel-fade">
      <div v-if="isOpen" class="theme-panel">
        <div class="theme-panel-header">
          <h3 class="theme-panel-title">🎨 Escolha seu Tema</h3>
          <button class="close-btn" @click="isOpen = false">×</button>
        </div>

        <div class="theme-grid">
          <button
            v-for="(theme, key) in themes"
            :key="key"
            class="theme-option"
            :class="{ active: themeStore.currentTheme === key }"
            @click="selectTheme(key)"
          >
            <div class="theme-preview" :style="{ background: theme.gradient }">
              <span class="theme-preview-icon">{{ theme.icon }}</span>
            </div>
            <div class="theme-info">
              <div class="theme-name">{{ theme.name }}</div>
              <div class="theme-description">{{ theme.description }}</div>
            </div>
            <div v-if="themeStore.currentTheme === key" class="active-indicator">✓</div>
          </button>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <transition name="overlay-fade">
      <div v-if="isOpen" class="theme-overlay" @click="isOpen = false"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useThemeStore, themes } from "../stores/themeStore";

const themeStore = useThemeStore();
const isOpen = ref(false);

const selectTheme = (themeName) => {
  themeStore.applyTheme(themeName);
  // Feedback visual
  const btn = document.querySelector('.theme-toggle-btn');
  if (btn) {
    btn.classList.add('pulse-theme');
    setTimeout(() => btn.classList.remove('pulse-theme'), 600);
  }
};
</script>

<style scoped>
.theme-selector-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 200;
}

.theme-toggle-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--theme-card-bg, rgba(30, 30, 46, 0.8));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 202;
}

.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 12px 32px var(--theme-glow, rgba(139, 92, 246, 0.4));
  border-color: var(--theme-primary, #8b5cf6);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.theme-icon {
  display: block;
  animation: float-icon 3s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes pulse-theme {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.pulse-theme {
  animation: pulse-theme 0.6s ease;
}

.theme-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 199;
}

.theme-panel {
  position: fixed;
  top: 90px;
  right: 24px;
  width: 420px;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background: linear-gradient(
    135deg,
    rgba(30, 30, 46, 0.98) 0%,
    rgba(24, 24, 37, 0.98) 100%
  );
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  z-index: 201;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.theme-panel::-webkit-scrollbar {
  width: 8px;
}

.theme-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.theme-panel::-webkit-scrollbar-thumb {
  background: var(--theme-primary, rgba(139, 92, 246, 0.5));
  border-radius: 4px;
}

.theme-panel::-webkit-scrollbar-thumb:hover {
  background: var(--theme-secondary, rgba(139, 92, 246, 0.7));
}

.theme-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.theme-panel-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 24px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 59, 48, 0.3);
  transform: rotate(90deg);
}

.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.theme-option::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--theme-primary, rgba(139, 92, 246, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.theme-option:hover::before {
  opacity: 1;
}

.theme-option:hover {
  transform: translateX(4px);
  border-color: var(--theme-primary, rgba(139, 92, 246, 0.5));
  box-shadow: 0 8px 24px var(--theme-glow, rgba(139, 92, 246, 0.3));
}

.theme-option.active {
  border-color: var(--theme-primary, #8b5cf6);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px var(--theme-glow, rgba(139, 92, 246, 0.4));
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.theme-preview-icon {
  font-size: 28px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.theme-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.theme-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.theme-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.active-indicator {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--theme-primary, #8b5cf6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  flex-shrink: 0;
  box-shadow: 0 4px 12px var(--theme-glow, rgba(139, 92, 246, 0.5));
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.theme-panel-fade-enter-active,
.theme-panel-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-panel-fade-enter-from,
.theme-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: all 0.3s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .theme-selector-container {
    top: 16px;
    right: 16px;
  }

  .theme-toggle-btn {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .theme-panel {
    top: 74px;
    right: 16px;
    left: 16px;
    width: auto;
    max-width: none;
  }
}
</style>
