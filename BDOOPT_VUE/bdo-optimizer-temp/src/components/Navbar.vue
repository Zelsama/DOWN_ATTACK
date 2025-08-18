<template>
  <nav class="navbar custom-navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item has-text-weight-bold">
        <img src="../assets/logo.jpg" alt="logoBdoOptimizer">
        BDO OPTIMIZER
      </router-link>

      <!-- Botão do menu mobile -->
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

    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <div class="navbar-start">
      </div>
        <nav class="navbar" role="navigation" aria-label="dropdown navigation">
        <div class="navbar-item has-dropdown is-hoverable" id="enchaning-navbar">
            <a class="navbar-link">
            Enhancing
            </a>
            <div class="navbar-dropdown">
            <a class="navbar-item">
                <router-link to="/enhancing-simulator" class="navbar-item custom-link">Enhancing Simulator</router-link>
            </a>
            </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable" id="enchaning-navbar">
            <a class="navbar-link">
            PVP
            </a>
            <div class="navbar-dropdown">
            <a class="navbar-item">
                <router-link to="/combo-builder" class="navbar-item custom-link">COMBO BUILDER</router-link>
            </a>
            </div>
        </div>        
        </nav>

      <!-- Item à direita -->
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">{{ regionStore.selectedRegion.label }}</a>
          <div class="navbar-dropdown is-right">
            <a v-for="region in regions" :key="region.value" class="navbar-item" :class="{'is-active': regionStore.selectedRegion.value === region.value}" @click="selectRegion(region)">
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
import { ref } from 'vue'; // Importar ref  
  
export default {  
  name: 'NavbarComponent',  
  setup() {   
    const regionStore = useRegionStore();  
  
    const isMenuOpen = ref(false);  
    const regions = ref([  
      { value: 'na', label: 'NA' },  
      { value: 'eu', label: 'EU' },  
      { value: 'sea', label: 'SEA' },  
      { value: 'mena', label: 'MENA' },  
      { value: 'kr', label: 'KR' },  
      { value: 'ru', label: 'RU' },  
      { value: 'jp', label: 'JP' },  
      { value: 'th', label: 'TH' },  
      { value: 'tw', label: 'TW' },  
      { value: 'sa', label: 'SA' },  
    ]);  
  
    function toggleMenu() {  
      isMenuOpen.value = !isMenuOpen.value;  
    }  
  
    function selectRegion(regionObject) {  
      regionStore.setRegion(regionObject);  
    }  
  
    return {  
      regionStore,  
      isMenuOpen,  
      regions,  
      toggleMenu,  
      selectRegion,  
    };  
  },  
};  
</script>

<style>
@import 'bulma/css/bulma.min.css';

.custom-navbar {
  background-color: #1A1A1A !important;
}




/* Cria um container central personalizado */
.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
html, body {
  background-color: #0e0e0e;
  min-height: 100vh;
}
@media screen and (max-width: 1023px) {
  .navbar-dropdown {
    min-width: 100%; /* Ocupa toda a largura */
    padding: 0.5rem;
    text-align: center;
    border: none;
    border-top: 1px solid #444;
  }
  
  .navbar-dropdown a {
    padding: 0.75rem;
    justify-content: center;
  }
}

/* Ajustes para mobile */
@media screen and (max-width: 1023px) {
  .navbar-center {
    position: static;
    left: auto;
    transform: none;
    order: 2; /* Coloca "Enhancing" no meio no mobile */
    width: 100%;
    text-align: center;
  }

  .navbar-start {
    order: 1;
  }

  .navbar-end {
    order: 3;
  }.custom-navbar .navbar-item {
  color: #EAEAEA;
}

  .navbar-menu.is-active {
    display: flex;
    flex-direction: column;
  }
}
</style>