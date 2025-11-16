# 🏆 ScoreArena

<div align="center">

**Sistema profissional de gerenciamento de pontuações para múltiplos jogadores**

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-ffd859?style=for-the-badge&logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Sobre o Projeto

**ScoreArena** é uma aplicação web moderna e intuitiva para gerenciar pontuações de múltiplos jogadores em tempo real. Com uma interface elegante em estilo glassmorphism e animações fluidas, o sistema oferece visualizações em grade e pódio, além de histórico completo de ações.

### ✨ Características Principais

- 🎮 **Gerenciamento de Jogadores**: Adicione, edite e remova jogadores facilmente
- 📊 **Sistema de Pontuação**: Adicione e subtraia pontos com total controle
- 🏅 **Visualização em Pódio**: Ranking visual com os top 3 jogadores
- 📋 **Visualização em Grade**: Lista completa de todos os jogadores
- 🕐 **Histórico de Ações**: Registro detalhado de todas as alterações com timestamp
- 💾 **Persistência de Dados**: Salvamento automático no LocalStorage
- 🎨 **Design Moderno**: Interface glassmorphism com animações suaves
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

---

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- **[Vue.js 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[Vite](https://vitejs.dev/)** - Build tool e dev server ultrarrápido
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado oficial do Vue
- **CSS3** - Estilização avançada com glassmorphism e animações

---

## 📦 Estrutura do Projeto

```
score-arena/
├── public/              # Arquivos públicos estáticos
├── src/
│   ├── assets/
│   │   └── style.css    # Estilos globais
│   ├── components/
│   │   ├── GlassButton.vue       # Botão com efeito glass
│   │   ├── GlassCard.vue         # Card com efeito glass
│   │   ├── HistoryPanel.vue      # Painel de histórico
│   │   ├── PlayerCard.vue        # Card de jogador
│   │   ├── PodiumView.vue        # Visualização de pódio
│   │   └── PointsDisplay.vue     # Display de pontos
│   ├── stores/
│   │   └── pointsStore.js        # Store Pinia
│   ├── App.vue          # Componente principal
│   └── main.js          # Ponto de entrada
├── index.html           # HTML principal
├── package.json         # Dependências do projeto
├── vite.config.js       # Configuração do Vite
└── README.md           # Este arquivo
```

---

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

### Passos

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/score-arena.git
   cd score-arena
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**

   ```bash
   npm run dev
   ```

4. **Acesse no navegador**
   ```
   http://localhost:5173
   ```

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

---

## 🎯 Funcionalidades

### Gerenciamento de Jogadores

- ➕ **Adicionar Jogador**: Crie novos jogadores com nome e pontuação inicial
- ✏️ **Editar Jogador**: Altere nome e pontos de jogadores existentes
- 🗑️ **Remover Jogador**: Exclua jogadores do sistema

### Sistema de Pontuação

- ➕ **Adicionar Pontos**: Incremente a pontuação de qualquer jogador
- ➖ **Subtrair Pontos**: Decremente a pontuação (com validação de limite)
- 🔢 **Pontuação Manual**: Defina valores específicos diretamente

### Visualizações

- **📋 Modo Grade**: Lista todos os jogadores com suas pontuações e controles
- **🏆 Modo Pódio**: Exibe os top 3 jogadores em um pódio animado
- **🕐 Histórico**: Painel lateral com registro completo de todas as ações

### Persistência

- 💾 **Salvamento Automático**: Todos os dados são salvos automaticamente no LocalStorage
- 🔄 **Recuperação**: Dados são restaurados ao recarregar a página

---

## 🎨 Design

O ScoreArena utiliza um design moderno baseado em **glassmorphism**, com:

- Efeitos de vidro translúcido com backdrop-filter
- Gradientes vibrantes no fundo
- Animações suaves em todas as interações
- Sombras e bordas delicadas
- Paleta de cores harmoniosa

---

## 📝 Licença

Este projeto está sob a licença ISC.

---

## 👨‍💻 Autor

Desenvolvido com 💙 por **Arian**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

<div align="center">

⭐ **Se este projeto foi útil, deixe uma estrela!** ⭐

</div>
