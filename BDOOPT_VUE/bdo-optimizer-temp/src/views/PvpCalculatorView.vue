<template>
  <div class="damage-calculator-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h4 class="title">Black Desert Damage Calculator</h4>
        <div class="header-buttons">
          <button class="btn" :class="{ 'active': mode === 'pvp' }" @click="mode = 'pvp'">One vs One</button>
          <button class="btn" :class="{ 'active': mode === 'pve' }" @click="mode = 'pve'">PvE</button>
        </div> 
      </div>

      <!-- Main Content -->
      <div class="main-grid">
        <!-- Player 1 Panel -->
        <div class="player-panel">
          <div class="panel-header player1">Player 1</div>
          <div class="dropdown" :class="{ 'is-active': showDropdown1 }" ref="dropdown1">
            <div class="dropdown-trigger">
              <input 
                class="input is-small input-with-icon" 
                type="text" 
                v-model="player1Search"
                @focus="showDropdown1 = true"
                @input="showDropdown1 = true"
                placeholder="Search class..."
              >
            </div>
            <div class="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a 
                  v-for="cls in filteredClasses1" 
                  :key="cls"
                  class="dropdown-item"
                  :class="{ 'is-active': player1.class === cls }"
                  @click="selectClass(1, cls)"
                >
                  {{ cls }}
                </a>
                <div v-if="filteredClasses1.length === 0" class="dropdown-item">
                  No results
                </div>
              </div>
            </div>
          </div>

          <!-- Offensive Stats -->
          <div class="section-title">Offensive</div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Sheet AP</label>
              <input type="number" v-model.number="player1.sheet_ap">
            </div>
            <div class="form-group">
              <label>Sheet AAP</label>
              <input type="number" v-model.number="player1.sheet_aap">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Total AP (PvP)</label>
              <input type="number" v-model.number="player1.total_ap_pvp">
            </div>
            <div class="form-group">
              <label>Total AAP (PvP)</label>
              <input type="number" v-model.number="player1.total_aap_pvp">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Accuracy</label>
              <input type="number" v-model.number="player1.accuracy">
            </div>
            <div class="form-group">
              <label>Crit Hit Rate %</label>
              <input type="number" v-model.number="player1.critical_hit_rate" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Critical %</label>
              <input type="number" v-model.number="player1.critical" step="0.1">
            </div>
            <div class="form-group">
              <label>Back Attack %</label>
              <input type="number" v-model.number="player1.back_attack" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Down Attack %</label>
              <input type="number" v-model.number="player1.down_attack" step="0.1">
            </div>
            <div class="form-group">
              <label>Air Attack %</label>
              <input type="number" v-model.number="player1.air_attack" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Skill Damage %</label>
              <div class="input-with-addon">
                <input type="number" v-model.number="player1.skill_damage_percent" class="main-input">
                <div class="hits-input-wrapper">
                  <input type="number" v-model.number="player1.skill_hits" class="addon-input">
                </div>
                
              </div>
            </div>
            <div class="form-group">
              <label>Skill PvP Reduction %</label>
              <input type="number" v-model.number="player1.skill_pvp_reduction_percent" step="0.01">
            </div>           
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Skill Spec</label>
              <select v-model="player1.skill_spec">
                <option value="awakening">Awakening</option>
                <option value="succession">Succession</option>
                <option value="ascension">Ascension</option>
              </select>
            </div>
            <div class="form-group">
              <label>Attack State</label>
              <select v-model="player1.state">
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
              <label>DR %</label>
              <input type="number" v-model.number="player1.dr_percent">
            </div>
            <div class="form-group">
              <label>Melee DR</label>
              <input type="number" v-model.number="player1.melee_dr" step="0.1">
            </div>
            <div class="form-group">
              <label>Ranged DR</label>
              <input type="number" v-model.number="player1.ranged_dr" step="0.1">
            </div>
            <div class="form-group">
              <label>Magic DR</label>
              <input type="number" v-model.number="player1.magic_dr" step="0.1">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Melee Evasion</label>
              <input type="number" v-model.number="player1.melee_evasion">
            </div>
            <div class="form-group">
              <label>Ranged Evasion</label>
              <input type="number" v-model.number="player1.ranged_evasion" step="0.1">
            </div>
            <div class="form-group">
              <label>Magic Evasion</label>
              <input type="number" v-model.number="player1.magic_evasion" step="0.1">
            </div>
          </div>

        </div>

        <!-- Center Field Panel -->
        <div class="field-panel">
          <div class="panel-header">Result</div>
          
          <div class="result-display">
            <div class="result-main">
              <div class="result-label">P1 → P2 Damage</div>
              <div class="result-value damage">{{ damage1to2 }}</div>
            </div>
            <div class="result-sub">
              <div class="result-item">
                <span class="label">Hit Chance</span>
                <span class="value hit">{{ hitChance1to2 }}%</span>
              </div>
            </div>
          </div>

          <div class="result-display">
            <div class="result-main">
              <div class="result-label">P2 → P1 Damage</div>
              <div class="result-value damage">{{ damage2to1 }}</div>
            </div>
            <div class="result-sub">
              <div class="result-item">
                <span class="label">Hit Chance</span>
                <span class="value hit">{{ hitChance2to1 }}%</span>
              </div>
            </div>
          </div>

          <button 
            class="btn-calculate" 
            @click="calculateDamage"
            :disabled="isCalculating"
          >
            {{ isCalculating ? 'Calculating...' : 'Calculate' }}
          </button>

          <div v-if="calculationError" class="error-message">
            {{ calculationError }}
          </div>

          <div class="field-info">
            <div class="info-row">
              <strong>{{ player1.class }}</strong> vs <strong>{{ player2.class }}</strong>
            </div>
            <div class="info-row">
              P1: <span class="highlight">{{ player1.state }}</span> | P2: <span class="highlight">{{ player2.state }}</span>
            </div>
          </div>
        </div>

        <!-- Player 2 Panel -->
        <div class="player-panel">
          <div class="panel-header player2">Player 2</div>
          
            <div class="dropdown" :class="{ 'is-active': showDropdown2 }" ref="dropdown2">
              <div class="dropdown-trigger">
                <input 
                  class="input is-small " 
                  type="text" 
                  v-model="player2Search"
                  @focus="showDropdown2 = true"
                  @input="showDropdown2 = true"
                  placeholder="Search class..."
                >
              </div>
              <div class="dropdown-menu" role="menu">
                <div class="dropdown-content">
                  <a 
                    v-for="cls in filteredClasses2" 
                    :key="cls"
                    class="dropdown-item"
                    :class="{ 'is-active': player2.class === cls }"
                    @click="selectClass(2, cls)"
                  >
                    {{ cls }}
                  </a>
                  <div v-if="filteredClasses2.length === 0" class="dropdown-item">
                    No results
                  </div>
                </div>
              </div>
            </div>

          <!-- Offensive Stats -->
          <div class="section-title">Offensive</div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Sheet AP</label>
              <input type="number" v-model.number="player2.sheet_ap">
            </div>
            <div class="form-group">
              <label>Sheet AAP</label>
              <input type="number" v-model.number="player2.sheet_aap">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Total AP (PvP)</label>
              <input type="number" v-model.number="player2.total_ap_pvp">
            </div>
            <div class="form-group">
              <label>Total AAP (PvP)</label>
              <input type="number" v-model.number="player2.total_aap_pvp">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Accuracy</label>
              <input type="number" v-model.number="player2.accuracy">
            </div>
            <div class="form-group">
              <label>Crit Hit Rate %</label>
              <input type="number" v-model.number="player2.critical_hit_rate" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Critical %</label>
              <input type="number" v-model.number="player2.critical" step="0.1">
            </div>
            <div class="form-group">
              <label>Back Attack %</label>
              <input type="number" v-model.number="player2.back_attack" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Down Attack %</label>
              <input type="number" v-model.number="player2.down_attack" step="0.1">
            </div>
            <div class="form-group">
              <label>Air Attack %</label>
              <input type="number" v-model.number="player2.air_attack" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Skill Damage %</label>
              <div class="input-with-addon">
                <input type="number" v-model.number="player2.skill_damage_percent" class="main-input">
                <div class="hits-input-wrapper">
                  <input type="number" v-model.number="player2.skill_hits" class="addon-input">
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Skill PvP Reduction %</label>
              <input type="number" v-model.number="player2.skill_pvp_reduction_percent" step="0.01">
            </div>           
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Skill Spec</label>
              <select v-model="player1.skill_spec">
                <option value="awakening">Awakening</option>
                <option value="succession">Succession</option>
                <option value="ascension">Ascension</option>
              </select>
            </div>
            <div class="form-group">
              <label>Attack State</label>
              <select v-model="player1.state">
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
              <label>DR %</label>
              <input type="number" v-model.number="player2.dr_percent">
            </div>
            <div class="form-group">
              <label>Melee DR</label>
              <input type="number" v-model.number="player2.melee_dr" step="0.1">
            </div>
            <div class="form-group">
              <label>Ranged DR</label>
              <input type="number" v-model.number="player2.ranged_dr" step="0.1">
            </div>
            <div class="form-group">
              <label>Magic DR</label>
              <input type="number" v-model.number="player2.magic_dr" step="0.1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Melee Evasion</label>
              <input type="number" v-model.number="player2.melee_evasion">
            </div>
            <div class="form-group">
              <label>Ranged Evasion</label>
              <input type="number" v-model.number="player2.ranged_evasion">
            </div>
            <div class="form-group">
              <label>Magic Evasion</label>
              <input type="number" v-model.number="player2.magic_evasion">
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import apiClient from '@/services/api';

export default {
  name: 'DamageCalculator',
  setup() {
    const mode = ref('pvp');
    const showDropdown1 = ref(false);
    const player1Search = ref('');
    const dropdown1 = ref(null);    
    const showDropdown2 = ref(false);
    const player2Search = ref('');
    const dropdown2 = ref(null);



    const classes = ref([
      'Warrior Succession', 'Warrior Awakening', 'Sorceress Succession', 'Sorceress Awakening',
      'Ranger Succession', 'Ranger Awakening', 'Berserker Succession', 'Berserker Awakening',
      'Tamer Succession', 'Tamer Awakening', 'Musa Succession', 'Musa Awakening',
      'Maehwa Succession', 'Maehwa Awakening', 'Valkyrie Succession', 'Valkyrie Awakening',
      'Wizard Succession', 'Wizard Awakening', 'Witch Succession', 'Witch Awakening',
      'Ninja Succession', 'Ninja Awakening', 'Kunoichi Succession','Kunoichi Awakening',
      'Dark Knight Succession', 'Dark Knight Awakening', 'Striker Succession', 'Striker Awakening',
      'Mystic Succession', 'Mystic Awakening', 'Lahn Succession', 'Lahn Awakening', 'Archer',
      'Corsair Succession', 'Corsair Awakening', 'Drakania Succession', 'Drakania Awakening',
      'Woosa Succession', 'Woosa Awakening', 'Maegu Succession', 'Maegu Awakening', 'Scholar',
      'Hashashin Succession', 'Hashashin Awakening', 'Deadeye', 'Wukong'
    ]);

    // Player 1 - Complete stats
    const player1 = ref({
      class: 'Warrior Succession',
      skill_spec: 'awakening',
      // Offensive
      total_ap_pvp: 986,
      total_aap_pvp: 988,
      sheet_ap: 383,
      sheet_aap: 385,
      accuracy: 1301,
      critical: 67.5,
      back_attack: 34.5,
      down_attack: 35.5,
      air_attack: 29.5,
      skill_damage_percent: 31821,
      skill_hits: 1,
      critical_hit_rate: 50,
      state: 'down_attack',
      // Defensive
      melee_dr: 661,
      ranged_dr: 661,
      magic_dr: 661,
      melee_evasion: 1152,
      ranged_evasion: 1152,
      magic_evasion: 1152,
      dr_percent: 30,
      class_pvp_modifier: 0.8929,
      skill_pvp_reduction_percent: 28.13
    });

    // Player 2 - Complete stats
    const player2 = ref({
      class: 'Sorceress Awakening',
      spec: 'awakening',
      // Offensive
      total_ap_pvp: 950,
      total_aap_pvp: 952,
      sheet_ap: 370,
      sheet_aap: 372,
      accuracy: 1250,
      critical: 65.0,
      back_attack: 32.0,
      down_attack: 33.0,
      air_attack: 28.0,
      skill_damage_percent: 30000,
      skill_hits: 1,
      critical_hit_rate: 48,
      state: 'normal',
      // Defensive
      melee_dr: 650,
      ranged_dr: 650,
      magic_dr: 650,
      melee_evasion: 1100,
      ranged_evasion: 1100,
      magic_evasion: 1100,
      dr_percent: 28,
      class_pvp_modifier: 0.85,
      skill_pvp_reduction_percent: 26.0
    });
    const apiResult1to2 = ref(null);
    const apiResult2to1 = ref(null);
    const isCalculating = ref(false);
    const calculationError = ref(null);


    // Player 1 attacks Player 2
    const damage1to2 = computed(() => {
      if (apiResult1to2.value) {
        return (apiResult1to2.value.hp_loss).toFixed(2);
      }
      return '---';
    });

    const hitChance1to2 = computed(() => {
      if (apiResult1to2.value) {
        return (apiResult1to2.value.hitrate * 100).toFixed(1);
      }
      return '---';
    });

    const damage2to1 = computed(() => {
      if (apiResult2to1.value) {
        return (apiResult2to1.value.hp_loss).toFixed(2);
      }
      return '---';
    });

    const hitChance2to1 = computed(() => {
      if (apiResult2to1.value) {
        return (apiResult2to1.value.hitrate * 100).toFixed(1);
      }
      return '---';
    });

    const parseClassAndSpec = (fullClassName) =>{
      const parts = fullClassName.split(' ');
      const noSpecClass = ['Archer', 'Deadeye', 'Wukong', 'Scholar'];
      if (noSpecClass.includes(fullClassName)) {
        return { className: fullClassName, spec: 'absolute' };
      }
      
      const spec = parts[parts.length - 1].toLowerCase();
      const className = parts.slice(0, parts.length - 1).join(' ');
      return { className, spec };
    };


    const calculateDamage = async () => {
      isCalculating.value = true;
      calculationError.value = null;
      
      try {
        // Parse das classes
        const player1Data = parseClassAndSpec(player1.value.class);
        const player2Data = parseClassAndSpec(player2.value.class);
        
        // Player 1 ataca Player 2
        const response1to2 = await apiClient.post('/pvp-calculator/calculate', {
          attacker_class: player1Data.className,
          defender_class: player2Data.className,
          attacker_class_spec: player1Data.spec,
          defender_class_spec: player2Data.spec,
          skill_spec: player1Data.spec,
          total_ap_pvp: player1.value.total_ap_pvp,
          total_aap_pvp: player1.value.total_aap_pvp,
          sheet_ap: player1.value.sheet_ap,
          sheet_aap: player1.value.sheet_aap,
          melee_dr: player2.value.melee_dr,
          ranged_dr: player2.value.ranged_dr,
          magic_dr: player2.value.magic_dr,
          accuracy: player1.value.accuracy,
          melee_evasion: player2.value.melee_evasion,
          ranged_evasion: player2.value.ranged_evasion,
          magic_evasion: player2.value.magic_evasion,
          dr_percent: player2.value.dr_percent,
          critical: player1.value.critical,
          back_attack: player1.value.back_attack,
          down_attack: player1.value.down_attack,
          air_attack: player1.value.air_attack,
          skill_damage_percent: player1.value.skill_damage_percent * player1.value.skill_hits,
          skill_pvp_reduction_percent: player1.value.skill_pvp_reduction_percent,
          critical_hit_rate: player1.value.critical_hit_rate,
          state: player1.value.state
        });

        // Player 2 ataca Player 1
        const response2to1 = await apiClient.post('/pvp-calculator/calculate', {
          attacker_class: player2Data.className,
          defender_class: player1Data.className,
          attacker_class_spec: player2Data.spec,
          defender_class_spec: player1Data.spec,
          skill_spec: player2Data.spec,
          total_ap_pvp: player2.value.total_ap_pvp,
          total_aap_pvp: player2.value.total_aap_pvp,
          sheet_ap: player2.value.sheet_ap,
          sheet_aap: player2.value.sheet_aap,
          melee_dr: player1.value.melee_dr,
          ranged_dr: player1.value.ranged_dr,
          magic_dr: player1.value.magic_dr,
          accuracy: player2.value.accuracy,
          melee_evasion: player1.value.melee_evasion,
          ranged_evasion: player1.value.ranged_evasion,
          magic_evasion: player1.value.magic_evasion,
          dr_percent: player1.value.dr_percent,
          critical: player2.value.critical,
          back_attack: player2.value.back_attack,
          down_attack: player2.value.down_attack,
          air_attack: player2.value.air_attack,
          skill_damage_percent: player2.value.skill_damage_percent * player2.value.skill_hits,
          skill_pvp_reduction_percent: player2.value.skill_pvp_reduction_percent,
          critical_hit_rate: player2.value.critical_hit_rate,
          state: player2.value.state
        });

        apiResult1to2.value = response1to2.data.data;
        apiResult2to1.value = response2to1.data.data;
        
        console.log('P1 → P2:', apiResult1to2.value);
        console.log('P2 → P1:', apiResult2to1.value);
        
      } catch (error) {
        console.error('API Error:', error);
        calculationError.value = error.response?.data?.error || 'Failed to calculate damage';
      } finally {
        isCalculating.value = false;
      }
    };
    const filteredClasses1 = computed(() => {
      if (!player1Search.value) return classes.value;
      return classes.value.filter(cls => 
        cls.toLowerCase().includes(player1Search.value.toLowerCase())
      );
    });    
    const filteredClasses2 = computed(() => {
      if (!player2Search.value) return classes.value;
      return classes.value.filter(cls => 
        cls.toLowerCase().includes(player2Search.value.toLowerCase())
      );
    });

    const selectClass = (playerNum, className) => {
      if (playerNum === 1) {
        player1.value.class = className;
        player1Search.value = className;
        showDropdown1.value = false;
      } else if (playerNum  === 2){
        player2.value.class = className;
        player2Search.value = className;
        showDropdown2.value = false;
      }
    };   
    const handleClickOutside = (event) => {
      if (dropdown1.value && !dropdown1.value.contains(event.target)) {
        showDropdown1.value = false;
      }
      if (dropdown2.value && !dropdown2.value.contains(event.target)) {
        showDropdown2.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      player1Search.value = player1.value.class;
      player2Search.value = player2.value.class;
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    return {
      mode,
      classes,
      player1,
      player2,
      damage1to2,
      hitChance1to2,
      damage2to1,
      hitChance2to1,
      calculateDamage,
      filteredClasses1,
      showDropdown1,
      player1Search,
      dropdown1,
      filteredClasses2,
      showDropdown2,
      player2Search,
      dropdown2,
      selectClass,
      isCalculating,
      calculationError
    };  
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.damage-calculator-page {
  background-color: #0e0f11;
  color: #e2e8f0;
  min-height: 100vh;
  padding: 8px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 10pt;
}

.container {
  max-width: 1340px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.title {
  color: #fff;
  margin: 0;
  font-size: 14pt;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 4px;
}

.btn {
  background-color: #4a5568;
  color: #e2e8f0;
  border: 1px solid #3e4753;
  padding: 4px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 9pt;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #5a6778;
}

.btn.active {
  background-color: #5a7ff2;
  border-color: #4a6fd2;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 280px 1fr;
  gap: 8px;
}

.player-panel,
.field-panel {
  background-color: #14161a;
  border: 1px solid #3e4753;
  border-radius: 4px;
  padding: 8px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.player-panel::-webkit-scrollbar,
.field-panel::-webkit-scrollbar {
  width: 6px;
}

.player-panel::-webkit-scrollbar-track,
.field-panel::-webkit-scrollbar-track {
  background: #0e0f11;
}

.player-panel::-webkit-scrollbar-thumb,
.field-panel::-webkit-scrollbar-thumb {
  background: #3e4753;
  border-radius: 3px;
}

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

.panel-header.player1 {
  color: #5a7ff2;
  border-color: #5a7ff2;
}

.panel-header.player2 {
  color: #f56565;
  border-color: #f56565;
}

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

.form-group {
  margin-bottom: 6px;
}

.form-group label {
  display: block;
  color: #c1c9d4;
  font-size: 8pt;
  margin-bottom: 2px;
}

.form-group input,
.form-group select {
  width: 100%;
  background-color: #12161b;
  color: #e2e8f0;
  border: 1px solid #3e4753;
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 9pt;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #5a7ff2;
  background-color: #0e0f11;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}

.field-panel {
  display: flex;
  flex-direction: column;
}

.result-display {
  background-color: #12161b;
  border: 1px solid #3e4753;
  border-radius: 3px;
  padding: 10px;
  margin-bottom: 8px;
}

.result-main {
  text-align: center;
  margin-bottom: 8px;
}

.result-label {
  font-size: 8pt;
  color: #a0aec0;
  margin-bottom: 4px;
}

.result-value {
  font-size: 24pt;
  font-weight: bold;
}

.result-value.damage {
  color: #f56565;
}

.result-sub {
  display: flex;
  justify-content: center;
}

.result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0e0f11;
  border-radius: 3px;
  padding: 6px 12px;
}

.result-item .label {
  font-size: 7pt;
  color: #718096;
  margin-bottom: 2px;
}

.result-item .value {
  font-size: 12pt;
  font-weight: bold;
}

.result-item .value.hit {
  color: #ecc94b;
}

.btn-calculate {
  width: 100%;
  background-color: #5a7ff2;
  color: white;
  border: 1px solid #4a6fd2;
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10pt;
  font-weight: 600;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.btn-calculate:hover {
  background-color: #4a6fd2;
}

.field-info {
  background-color: #12161b;
  border: 1px solid #3e4753;
  border-radius: 3px;
  padding: 8px;
  font-size: 8pt;
  color: #a0aec0;
}

.info-row {
  margin-bottom: 4px;
  text-align: center;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-row strong {
  color: #e2e8f0;
}

.info-row .highlight {
  color: #ecc94b;
  font-weight: 600;
}

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
.dropdown {
  position: relative;
  width: 100%;
}
.dropdown-menu {
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-content {
  background-color: #12161b;
  border: 1px solid #3e4753;
  overflow: visible;
}

.dropdown-item {
  color: #e2e8f0;
  font-size: 9pt;
}

.dropdown-item:hover {
  background-color: #1a1d23;
  color: #e2e8f0;
}

.dropdown-item.is-active {
  background-color: #5a7ff2;
  color: white;
}
.input-with-addon {
  display: flex;
  gap: 2px;
  width: 100%;
}

.input-with-addon .main-input {
  flex: 1 !important;
  width: 60% !important;
  min-width: 0 !important;
}

.input-with-addon .addon-input {
  width: 35px !important;
  flex: 0 0 35px !important;
  text-align: center;
}
.input-with-addon {
  display: flex;
  gap: 4px;
  align-items: center;
}

.hits-input-wrapper {
  position: relative;
  width: 17%;
  flex-shrink: 0;
}

.hits-input-wrapper::before {
  content: 'x';
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  font-weight: bold;
  font-size: 9pt;
  pointer-events: none;
  z-index: 1;
}

.addon-input {
  width: 100%;
  padding-left: 18px !important;
  text-align: center;
  background-color: #12161b;
  color: #e2e8f0;
  border: 1px solid #3e4753;
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 9pt;
}

.main-input {
  flex: 1;
  background-color: #12161b;
  color: #e2e8f0;
  border: 1px solid #3e4753;
  border-radius: 2px;
  padding: 3px 5px;
  font-size: 9pt;
}
.error-message {
  background-color: #f56565;
  color: white;
  padding: 8px;
  border-radius: 3px;
  margin-top: 8px;
  font-size: 8pt;
  text-align: center;
}

.btn-calculate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
@media (max-width: 1366px) {
  .main-grid {
    grid-template-columns: 1fr 260px 1fr;
    gap: 6px;
  }
  
  .container {
    max-width: 100%;
  }
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .field-panel {
    order: -1;
  }
}

</style>