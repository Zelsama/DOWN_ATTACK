<template>
  <nav class="navbar custom-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item logo-item has-text-weight-bold">
        <img src="../assets/logo.jpg" alt="logoBdoOptimizer" style="margin-right: 10px;">
        BDO OPTIMIZER
      </router-link>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        :class="{ 'is-active': isMenuOpen }"
        @click="toggleMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navMenu" class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <div class="navbar-start">
        <!-- Enhancing Dropdown -->
        <div 
          class="navbar-item has-dropdown" 
          :class="{ 'is-active': activeDropdown === 'enhancing' }"
          @mouseover="activeDropdown = 'enhancing'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">Enhancing</a>
          <div class="navbar-dropdown">
            <router-link 
              to="/enhancing-simulator" 
              class="navbar-item" 
              active-class="is-active"
              @click="activeDropdown = null"
            >
              Enhancing Simulator
            </router-link>
          </div>
        </div>

        <!-- PVP Dropdown -->
        <div 
          class="navbar-item has-dropdown" 
          :class="{ 'is-active': activeDropdown === 'pvp' }"
          @mouseover="activeDropdown = 'pvp'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">PVP</a>
          <div class="navbar-dropdown">
            <router-link 
              to="/combo-builder" 
              class="navbar-item" 
              active-class="is-active"
              @click="activeDropdown = null"
            >
              Combo Builder
            </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <!-- Region Dropdown -->
        <div 
          class="navbar-item has-dropdown" 
          :class="{ 'is-active': activeDropdown === 'region' }"
          @mouseover="activeDropdown = 'region'"
          @mouseleave="activeDropdown = null"
        >
          <a class="navbar-link">{{ regionStore.selectedRegion.label }}</a>
          <div class="navbar-dropdown is-right">
            <a
              v-for="region in regions"
              :key="region.value"
              class="navbar-item"
              :class="{'is-active': regionStore.selectedRegion.value === region.value}"
              @click="selectRegion(region)"
            >
              {{ region.label }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRegionStore } from '../stores/regionStore';
import { ref } from 'vue';

export default {
  name: 'NavbarComponent',
  setup() {
    const regionStore = useRegionStore();
    const isMenuOpen = ref(false);
    const activeDropdown = ref(null); // Controla qual dropdown está ativo

    const regions = ref([
      { value: 'na', label: 'NA' },
      { value: 'eu', label: 'EU' },
      { value: 'sa', label: 'SA' },
    ]);

    function toggleMenu() {
      isMenuOpen.value = !isMenuOpen.value;
    }

    function selectRegion(regionObject) {
      regionStore.setRegion(regionObject);
      activeDropdown.value = null; // Fecha o dropdown após a seleção
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
      }
    }

    return {
      regionStore,
      isMenuOpen,
      regions,
      toggleMenu,
      selectRegion,
      activeDropdown, // Expõe a variável para o template
    };
  },
};
</script>

<style>
@import 'bulma/css/bulma.min.css';

.custom-navbar .navbar-item:hover,
.custom-navbar .navbar-link:hover {
  color: #ffffff;
}

/* --- Layout e Centralização --- */
/* Força o menu a ocupar o espaço restante */
.navbar-menu {
  flex-grow: 1;
}

/* Centraliza o navbar-start usando margens automáticas */
.navbar-start {
  margin: 0 auto;
}

/* --- Estilo da Seta do Dropdown --- */
.navbar-link::after {
  border-color: #8a93f0; /* Tom de azul/roxo da imagem */
  border-width: 0 1.5px 1.5px 0;
  height: 6px;
  width: 6px;
  margin-top: -4px;
  transition: border-color 0.2s ease;
}

.navbar-link:hover::after {
  border-color: #ffffff;
}

/* --- Estilo do Dropdown --- */
.navbar-dropdown {
  background-color: #222;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.25rem 0;
}

.navbar-dropdown .navbar-item {
  font-size: 0.85rem;
  color: #ccc;
}

.navbar-dropdown .navbar-item:hover,
.navbar-dropdown .navbar-item.is-active {
  background-color: #333 !important;
  color: #fff !important;
}

/* --- Logo e Burger --- */
.logo-item {
  color: #e0e2e4 !important;
}

.navbar-burger {
  color: #EAEAEA;
}

/* --- Responsividade Mobile --- */
@media screen and (max-width: 1023px) {
  .navbar-menu.is-active {
    background-color: #1A1A1A;
  }
  
  /* Remove a centralização no mobile */
  .navbar-start {
    margin: 0;
  }

  .navbar-dropdown {
    background-color: transparent;
    border: none !important;
    text-align: center;
  }
}
</style>