<template>
  <div class="player-panel">
    <!-- Header -->
    <div class="panel-header" :class="playerNumber === 1 ? 'player1' : 'player2'">
      {{ label }}
    </div>

    <!-- Class Search Dropdown -->
    <div class="dropdown" :class="{ 'is-active': showDropdown }" ref="dropdownRef">
      <div class="dropdown-trigger">
        <input 
          class="input is-small input-with-icon" 
          type="text" 
          v-model="searchQuery"
          @focus="showDropdown = true"
          @input="showDropdown = true"
          placeholder="Search class..."
        >
      </div>
      <div class="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a 
            v-for="cls in filteredClasses" 
            :key="cls"
            class="dropdown-item"
            :class="{ 'is-active': localPlayer.class === cls }"
            @click="selectClass(cls)"
          >
            {{ cls }}
          </a>
          <div v-if="filteredClasses.length === 0" class="dropdown-item">
            No results
          </div>
        </div>
      </div>
    </div>

    <!-- Offensive Stats -->
    <div class="section-title">Offensive</div>
    
    <!-- NOTE QUE AGORA USAMOS localPlayer AO INVÉS DE modelValue -->
    <div class="form-row">
      <div class="form-group">
        <label>Sheet AP</label>
        <input type="number" v-model.number="localPlayer.sheet_ap">
      </div>
      <div class="form-group">
        <label>Sheet AAP</label>
        <input type="number" v-model.number="localPlayer.sheet_aap">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Total AP (PvP)</label>
        <input type="number" v-model.number="localPlayer.total_ap_pvp">
      </div>
      <div class="form-group">
        <label>Total AAP (PvP)</label>
        <input type="number" v-model.number="localPlayer.total_aap_pvp">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Accuracy</label>
        <input type="number" v-model.number="localPlayer.accuracy">
      </div>
      <div class="form-group">
        <label>Crit Hit Rate %</label>
        <input type="number" v-model.number="localPlayer.critical_hit_rate" step="0.1">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Critical %</label>
        <input type="number" v-model.number="localPlayer.critical" step="0.1">
      </div>
      <div class="form-group">
        <label>Back Attack %</label>
        <input type="number" v-model.number="localPlayer.back_attack" step="0.1">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Down Attack %</label>
        <input type="number" v-model.number="localPlayer.down_attack" step="0.1">
      </div>
      <div class="form-group">
        <label>Air Attack %</label>
        <input type="number" v-model.number="localPlayer.air_attack" step="0.1">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Skill Damage %</label>
        <div class="input-with-addon">
          <input type="number" v-model.number="localPlayer.skill_damage_percent" class="main-input">
          <div class="hits-input-wrapper">
            <input type="number" v-model.number="localPlayer.skill_hits" class="addon-input">
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Skill PvP Reduction %</label>
        <input type="number" v-model.number="localPlayer.skill_pvp_reduction_percent" step="0.01">
      </div>           
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Skill Spec</label>
        <select v-model="localPlayer.skill_spec">
          <option value="awakening">Awakening</option>
          <option value="succession">Succession</option>
          <option value="ascension">Ascension</option>
        </select>
      </div>
      <div class="form-group">
        <label>Attack State</label>
        <select v-model="localPlayer.state">
          <option value="normal">Normal</option>
          <option value="back_attack">Back Attack</option>
          <option value="down_attack">Down Attack</option>
          <option value="air_attack">Air Attack</option>
        </select>
      </div>
    </div>

    <!-- Defensive Stats -->
    <div class="section-title">Defensive</div>

    <div class="form-row">
      <div class="form-group">
        <label>Damage Reduction %</label>
        <input type="number" v-model.number="localPlayer.dr_percent">
      </div>
      <div class="form-group">
        <label>Melee Damage Reduction</label>
        <input type="number" v-model.number="localPlayer.melee_dr" step="0.1">
      </div>
      <div class="form-group">
        <label>Ranged Damage Reduction</label>
        <input type="number" v-model.number="localPlayer.ranged_dr" step="0.1">
      </div>
      <div class="form-group">
        <label>Magic Damage Reduction</label>
        <input type="number" v-model.number="localPlayer.magic_dr" step="0.1">
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Melee Evasion</label>
        <input type="number" v-model.number="localPlayer.melee_evasion">
      </div>
      <div class="form-group">
        <label>Ranged Evasion</label>
        <input type="number" v-model.number="localPlayer.ranged_evasion" step="0.1">
      </div>
      <div class="form-group">
        <label>Magic Evasion</label>
        <input type="number" v-model.number="localPlayer.magic_evasion" step="0.1">
      </div>
      <div class="form-group">
        <label>Health Points</label>
        <input type="number" v-model.number="localPlayer.hp" step="0.1">
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export default {
  name: 'PlayerPanel',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    label: {
      type: String,
      default: 'Player'
    },
    playerNumber: {
      type: Number,
      default: 1
    },
    availableClasses: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showDropdown = ref(false);
    const searchQuery = ref('');
    const dropdownRef = ref(null);

    // --- AQUI ESTÁ A MÁGICA PARA CORRIGIR O ERRO ---
    // Criamos um computed que intercepta as mudanças
    const localPlayer = computed({
      get: () => props.modelValue,
      set: (newValue) => emit('update:modelValue', newValue)
    });

    // Inicializa a busca com a classe atual
    watch(() => props.modelValue.class, (newVal) => {
      if (newVal && !searchQuery.value) {
        searchQuery.value = newVal;
      }
    }, { immediate: true });

    const filteredClasses = computed(() => {
      if (!searchQuery.value) return props.availableClasses;
      return props.availableClasses.filter(cls => 
        cls.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const selectClass = (className) => {
      // Atualiza via o computed localPlayer, que dispara o emit automaticamente
      // Precisamos clonar o objeto para garantir a reatividade correta
      localPlayer.value = { ...localPlayer.value, class: className };
      
      searchQuery.value = className;
      showDropdown.value = false;
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showDropdown,
      searchQuery,
      dropdownRef,
      filteredClasses,
      selectClass,
      localPlayer // Retornamos o computed para usar no template
    };
  }
};
</script>

<style scoped>
/* Copie aqui todo o CSS relacionado aos inputs, dropdowns e painéis que estava no arquivo original */
.player-panel {
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  padding: 8px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.player-panel::-webkit-scrollbar { width: 6px; }
.player-panel::-webkit-scrollbar-track { background: #0e0f11; }
.player-panel::-webkit-scrollbar-thumb { background: #3e4753; border-radius: 3px; }

.panel-header {
  background-color: #12161b;
  border: 1px solid #3e4753;
  border-radius: 3px;
  padding: 4px 8px;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 10pt;
}

.panel-header.player1 { color: #5a7ff2; border-color: #5a7ff2; }
.panel-header.player2 { color: #f56565; border-color: #f56565; }

.section-title {
  background-color: #0e0f11;
  color: #a0aec0;
  padding: 4px 6px;
  margin: 8px 0 6px 0;
  font-size: 8pt;
  font-weight: 600;
  text-transform: uppercase;
  border-left: 3px solid #5a7ff2;
}

.form-group { margin-bottom: 6px; }
.form-group label { display: block; color: #c1c9d4; font-size: 8pt; margin-bottom: 2px; }
.form-group input, .form-group select {
  width: 100%; background-color: #12161b; color: #e2e8f0;
  border: 1px solid #3e4753; border-radius: 2px; padding: 3px 5px; font-size: 9pt;
}
.form-group input:focus, .form-group select:focus {
  outline: none; border-color: #5a7ff2; background-color: #0e0f11;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px; }

/* Dropdown Styles */
.dropdown { position: relative; width: 100%; }
.dropdown-menu { position: absolute; width: 100%; z-index: 10; }
.dropdown-content { background-color: #12161b; border: 1px solid #3e4753; max-height: 200px; overflow-y: auto; }
.dropdown-menu, .dropdown-content { box-sizing: border-box; width: 100%;}
.dropdown-item { display: block; padding: 4px 8px; color: #e2e8f0; font-size: 9pt; cursor: pointer; }
.dropdown-item:hover { background-color: #1a1d23; }
.dropdown-item.is-active { background-color: #5a7ff2; color: white; }

/* Input Addon Styles */
.input-with-addon { display: flex; gap: 4px; align-items: center; }
.hits-input-wrapper { position: relative; width: 17%; flex-shrink: 0; }
.hits-input-wrapper::before {
  content: 'x'; position: absolute; left: 6px; top: 50%; transform: translateY(-50%);
  color: #a0aec0; font-weight: bold; font-size: 9pt; pointer-events: none; z-index: 1;
}
.addon-input { padding-left: 18px !important; text-align: center; }
.main-input { flex: 1; }

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; }
</style>