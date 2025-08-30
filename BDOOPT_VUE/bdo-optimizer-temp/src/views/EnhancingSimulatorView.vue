<template>
  <div class="optimizer-page">
    <div>
      <div class="container page-header">
        <h4 class="title is-4">Enhancing Simulator</h4>
        <button class="button" id="modal-button" @click="showModalBestStack(), stackOptimizer()">Best Failtacks</button>
        <div :class="{modal: true, 'is-active': showModal}">
          <div class="modal-background"></div>
          <div class="modal-card is-wide-modal">
            <header class="modal-card-head">
              <p class="modal-card-title">Best Failstacks</p>
              <button class="delete" aria-label="close" @click="hideModal()"></button>
            </header>
            <section class="modal-card-body">
              <!-- Content ... -->
              <div class="field is-flex is-justify-content-space-between">
                <div class="field has-addons">

                  <p class="control">
                    <a class="button is-static">
                      <span class="icon is-medium">
                        <img :src="modalIcon" alt="">
                      </span>
                    </a>
                  </p>
                  <div class="control">
                    <div class="select">
                      <select @change='changeModalicon($event), stackOptimizer()'>
                        <option value="Sovereign">Sovereign Weapons</option>                      
                        <option value="Armors">Fallen Gods Armors</option>
                        <option value="Kharazad">Kharazad Accessories</option>
                      </select>
                    </div>                  
                  </div>
                </div>
                <div class="control">
                  <div class="select" id="modal-tier-select" @change="changeModalTier($event),stackOptimizer()">
                    <select>
                      <option v-if="modalCurrentItem === 'Armors'" value="2">DUO (II)</option>
                      <option value="3">TRI (III)</option>
                      <option value="4">TET (IV)</option>
                      <option value="5">PEN (V)</option>
                      <option value="6">HEX (VI)</option>
                      <option value="7">HEP (VII)</option>
                      <option value="8">OCT (VIII)</option>
                      <option value="9">ENE (IX)</option>
                    </select>
                  </div>                  
                </div>              
              </div>
              <div class="field">
                <label class="label">Starting failstack:</label>
                <div class="control">
                  <input type="number" v-model.number="optimizeStackbase" @input="stackOptimizer()" class="input">  
                </div>
              </div>
              <div class="modal-form-row">              
                <div class="field">
                  <label class="label">Permanent Enhancement Chance:</label>
                  <div class="field has-addons">
                    <p class="control">
                      <a class="button is-static">
                        <span class="icon is-medium">
                          <img src="../assets/adicional-enhanment-chance.png" alt="">
                        </span>
                      </a>  
                    </p>
                    <div class="control">
                      <div class="select">
                        <select v-model.number="modalPermaEnhanceValue" @change="stackOptimizer()">
                          <option value="0">+0</option>
                          <option value="1">+1</option>
                          <option value="2">+2</option>
                          <option value="3">+3</option>
                          <option value="4">+4</option>
                          <option value="5">+5</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field">
                  <label class="label">Valk's Cry:</label>
                  <div class="field has-addons">
                    <p class="control">
                      <a class="button is-static">
                        <span class="icon is-medium">
                          <img src="../assets/valkscry.png" alt="">
                        </span>
                      </a>
                    </p>
                    <p class="control">
                      <input type="number" v-model.number="modalVaksCry" class="input" @input="limitModalValks(), stackOptimizer()">
                    </p>
                  </div>
                </div>
              </div>
              <div class="modal-loading content mt-5">
                <progress v-show="modalLoading == true && modalError != true" class="progress is-large is-info content mt-5" max="100">60%</progress>              
              </div>

              <div v-show="modalError != true && modalLoading != true" class="content mt-5">
                <blockquote>
                  <p>Optimal base Failstack: <strong>{{ modalOptimizeStackbase }}</strong></p>
                  <p>Optimal Total Failstack (with valk's cry more Permanent Enhance Chance): <strong>{{ modalOptimizeStackTotal }}</strong></p>
                </blockquote>
              </div>     
                <article v-show="modalError === true && modalLoading != true" class="message is-danger content mt-5">
                  <div class="message-body">
                    <p>{{ errorMessage }}</p>
                  </div>
                </article>     
              <div v-if="log.length > 0 && modalError != true && modalLoading != true" class="mt-4">  
                  <a @click="showLog = !showLog">  
                    {{ showLog ? '[Hide Details]' : '[Show Details]' }}  
                  </a>  
              </div> 
              <div v-if="showLog" class="mt-4 content">
                <div class="table-container">
                  <table class="table is-fullwidth is-striped">
                    <thead>
                      <tr>
                        <th>Stack</th>
                        <th>Gain</th>
                        <th>Type</th>
                        <th>Average</th>
                        <th>Gain</th>
                        <th class="has-text-right">Save Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(entry, index) in log" :key="index">
                        <td v-if="entry.event === 'Analysis'">{{ entry.from.fs }} -> {{ entry.to.fs }}</td>
                        <td v-if="entry.event === 'Analysis'">+{{ entry.to.fs - entry.from.fs }}</td>
                        <td v-if="entry.event === 'Analysis'">
                          <figure v-if="entry.type === 'Dark Hunger'" class="image is-24x24" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <img src="../assets/Dark_Hunger.png" alt="">
                          </figure>
                          <figure v-if="entry.type === 'Faint Dark Hunger'" class="image is-24x24" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                            <img src="../assets/Faint_Dark_Hunger.png" alt="">
                          </figure>
                        </td>
                        <td v-if="entry.event === 'Analysis'">{{ entry.from.avgAttemps }} -> {{ entry.to.avgAttemps }}</td>
                        <td v-if="entry.event === 'Analysis'">-{{ entry.savedAttempts }}</td>
                        <td v-if="entry.event === 'Analysis'" class="has-text-right">{{ formatModalSaveCost(entry.saveCost) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="showLog" class="has-text-right mt-4">
                    <p class="has-text-weight-bold">
                      Total: {{ formatModalSaveCost(modalTotalSaveCost) }}
                    </p>
                  </div>

                </div>
              </div>                             
            </section>
          </div>
        </div>      
      </div>
      <div class="main-content mb-5">
        <LeftPanel
        :average-attempts = "AverageAtmps"
        :durability-loss = "durabilityLoss"
        :softcap = "softcap"
        ></LeftPanel>
        <div class="card mb-0">
          <div class="card-content">
            <!-- ... (código do top-row e enchant_diagram continua o mesmo) ... -->
            <div class="top-row">
              <div class="weapon-container">
                <img v-if="currentIconUrl" :src="currentIconUrl" alt="sovereign weapon" class="sovereign-img" :style="{ border: '2px solid ' + currentColor }">
                <span v-if="selectTier && selectTier !== '0' && selectTier !== '+0'" class="Tier">{{ selectTier }}</span>
              </div>
              <div class="dropdown" :class="{'is-active': isEditing}" ref="dropdownRef">
                <div class="dropdown-trigger">
                  <button v-if="!isEditing" class="button" @click.stop="isEditing = true">
                    <span class="button-label-group">
                      <span> {{ selectedItem.text }} </span>            
                    </span>
                    <span class="icon is-small">
                      <i class="css-arrow" aria-hidden="true"></i>
                    </span>
                  </button>    
                  <div v-else class="control has-icon-right">
                    <input class="input" type="text" v-model="searchTerm" :placeholder="selectedItem.text" @click.stop>
                    <span class="input-arrow-icon">
                      <i class="css-arrow" aria-hidden="true"></i>
                    </span>
                  </div>    
                  
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-content">
                    <a v-for="item in filteredItems" :key="item.id" href="#" class="dropdown-item" @click="selectItem(item), selectCurrentIcon(item.icon, item.colorClass, item.id,item.text), getSuccessRateAndData(), debouncedSaveState()">
                      <img v-if="item.icon" :src="item.icon" class="dropdown-item-icon" :style="{ border: '2px solid' + item.colorClass }" alt="Item Icon">
                      <span :style="{ color: item.colorClass}"> {{ item.text }} </span>
                    </a>
                  </div>

                </div>

              </div>          
              <div class="select" id="select-content">
                <select id="tier-select" v-model="selectTier" @change="tierChange($event)" ref="tierSelect">
                  <option v-if="profileKeyPEN.includes(profileKey)" value="IX">ENE (IX)</option>  
                  <option v-if="profileKeyPEN.includes(profileKey)" value="VIII">OCT (VIII)</option>  
                  <option v-if="profileKeyPEN.includes(profileKey)" value="VII">SEP (VII)</option>  
                  <option v-if="profileKeyPEN.includes(profileKey)" value="VI">HEX (VI)</option>  
                  <option v-if="profileKeyPEN.includes(profileKey)" value="V">PEN (V)</option>  
                  <option value="IV">TET (IV)</option>  
                  <option value="III">TRI (III)</option>  
                  <option value="II">DUO (II)</option>  
                  <option value="I">PRI (I)</option>
                  <option v-if='profileKeys.includes(profileKey)' value="0"></option>
                  <template v-if="!profileKeys.includes(profileKey)">
                    <option v-for="level in reversedLevels" :key="level" :value="'+'+ level">{{ '+'+level }}</option>
                    <option value="+0">+0</option>
                  </template>
                  
                </select>
              </div>
            </div>
            <div id="enchant_diagram">
              <img id="diagram-background-img" src="../assets/enchant_diagram.png" alt="enchant_diagram">
              <div class="diagram-overlay diagram-icon-container" id="cron-overlay">
                <img src="../assets/cron_icon.png" alt="Cron Stone" class="diagram-icon-img">
                <span class="cron-amount-text"> {{ crons }}</span>
              </div>
              <div class="diagram-overlay diagram-icon-container" id="blackstone-overlay">
                <img v-if="currentItem === 'Kharazad Accessories' && selectTier === 'IX'" src="../assets/dawn_blackstone.png" alt="Blackstone" class="diagram-icon-img">
                <img v-else :src="blackstoneIcon" alt="Blackstone" class="diagram-icon-img">
                <span v-if="essence > 0" class="essence-amount-text"> {{ essence }}</span>
              </div>
              <div class="diagram-overlay" id="chance-overlay">
                  <span> {{ successRate }}% </span>
              </div>      
              <div class="weapon-container" id="result-item-overlay" ref="resultItemOverlay">
                  <img v-if="currentIconUrl" :src="currentIconUrl" alt="" class="sovereign-img" :style = "{ border: '2px solid ' + currentColor }">
                  <span v-if='selectTier && selectTier !== "0" && selectTier !== "+0"' class="Tier">{{ selectTier }}</span>
                </div>              
            </div>

            <!-- BLOCO DE STATS CORRIGIDO -->
            <div id="enchant-stats">

              <!-- Linha 1: Additional Enhancement Chance -->
              <div class="stat-row">
                <div class="stat-label-group">
                  <figure class="image is-24x24 stat-icon">
                    <img src="../assets/adicional-enhanment-chance.png" alt="Additional Chance Icon">
                  </figure>
                  <p class="stat-label is-hidden-mobile"><b>Additional Enhancement Chance</b></p>
                </div>
                <div class="stat-controls field has-addons is-vcentered">

                  <p class="control">
                    <input class="input is-small" type="number" v-model.number="currentChance" @input="limitCurrentChance">
                  </p>
                  <p class="control">
                    <button class="button is-small" @click="currentChancePlus">+</button>
                  </p>
                  <p class="control">
                    <button class="button is-small" @click="currentChanceMinus">-</button>
                  </p>              
                </div>
              </div>

              <!-- Linha 2: Valk's Cry -->
              <div class="stat-row">
                <div class="stat-label-group">
                  <figure class="image is-24x24 stat-icon">
                    <img src="../assets/valkscry.png" alt="Valk's Cry Icon">
                  </figure>
                  <p class="stat-label is-hidden-mobile"><b>Valk's Cry</b></p>
                </div>
                <div class="stat-controls field has-addons">

                  <p class="control">
                    <input class="input is-small" type="number" v-model.number="valksCry" @input="limitValks">
                  </p>
                  <p class="control">
                    <button class="button is-small" @click="valksPlus()">+</button>
                  </p>
                  <p class="control">
                    <button class="button is-small" @click="valksMinus()">-</button>
                  </p>              
                </div>
              </div>

              <!-- Linha 3: Permanent Enhancement Chance -->
              <div class="stat-row">
                <div class="stat-label-group">
                  <figure class="image is-24x24 stat-icon">
                    <img src="../assets/adicional-enhanment-chance.png" alt="Permanent Chance Icon">
                  </figure>
                  <p class="stat-label is-hidden-mobile"><b>Permanent Enhancement Chance</b></p>
                </div>
                <div class="stat-controls buttons has-addons">
                  <button v-for="i in 6" :key="i-1" @click="selectPermaEnchantButton(i-1)" class="button is-small" :class="{ 'is-success': permaEnhActive === i-1 }">
                    +{{ i-1 }}
                  </button>
                </div>
              </div>

              <!-- Linha 4: Current Enhancement Chance -->
              <div class="stat-row">
                <div class="stat-label-group">
                  <figure class="image is-24x24 stat-icon">
                    <img src="../assets/current-enhancement-chance.png" alt="Current Chance Icon">
                  </figure>
                  <p class="stat-label is-hidden-mobile"><b>Current Enhancement Chance</b></p>
                </div>
                <div class="stat-controls">
                  <h5 class="subtitle is-5 has-text-weight-bold has-text-light">+ {{ currentChanceTotal }}</h5>
                </div>
              </div>

            </div>

          </div>
        </div>
        <EnhancingCalculator :base-success-rate="leftPanelChance"></EnhancingCalculator>
        <EnhancingSimulator :base-success-rate="leftPanelChance"></EnhancingSimulator>              
      </div>            
    </div>    
  </div>
</template>

<script>
import LeftPanel from '@/components/EnhancingLeftPanel.vue'
import apiClient from '@/services/api';
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, watch } from 'vue';
import sovereignIcon from '../assets/Base.jpg';
import kharazadIcon from '../assets/khazard_necklace.png';
import labreskaIcon from '../assets/labreska_helmet.png';
import { useRegionStore } from '@/stores/regionStore';
import allItemsData from '../data/enhancingItems'
import EnhancingCalculator from '@/components/EnhancingCalculator.vue';
import EnhancingSimulator from '@/components/EnhancingSimulator.vue';
import { useLoading } from '../composables/useLoading';
import defaultIcon from '../assets/default_icon.png';
import { nextTick } from 'vue';


export default {
    name: 'EnhacingSimulatorView',
    components:{
      LeftPanel,
      EnhancingCalculator,
      EnhancingSimulator
    },
    setup(){  
        const scrollDebounceTimer = ref(null);
        const saveStateDebounceTimer = ref(null);

        const profileKeys = ref(['PURPLE_ACCESSORIES', 'PURPLE_WEAPON', 'GREEN_ACCESSORIES', 'BLUE_ACCESSORIES', 'YELLOW_ACCESSORIES', 'GODR_WEAPON']);
        const profileKeyPEN = ref(['PURPLE_ACCESSORIES', 'PURPLE_WEAPON']);
        /* MODAL VARIAVEIS: */
        const showModal = ref(false);
        const modalCurrentItem = ref('Sovereign');
        const modalTier = ref(3);
        const modalVaksCry = ref(0);
        const modalPermaEnhanceValue = ref(0);
        const modalError = ref(false);
        const modalLoading = ref(false);
        const modalOptimizeStackbase = ref(0);
        const modalOptimizeStackTotal = ref(0);
        const modalTotalSaveCost = ref(0);
        const modalIcon = ref(sovereignIcon);
        const log = ref(['']);
        const errorMessage = ref(null);
        const optimizerDebounce = ref(null);
        const optimizeStackbase = ref(100);
        const showLog = ref(false);

        /* OPTIMIZER VARIAVEIS: */
        const isLoading = ref(true);
        const successRate = ref(0);
        const essence = ref(0);
        const crons = ref(0);
        const profileKey = ref('');
        const durabilityLoss = ref(0);
        const softcap = ref(0);
        const AverageAtmps = ref(0);
        const leftPanelChance = ref(0);
        const blackstoneIcon = ref(defaultIcon);

        /* Current item, icon variaveis */
        const currentIconUrl = ref('');
        const currentColor = ref('#8a63d2');
        const currentItem = ref(null);

        const showResult = ref(false);
        const selectTierNumber = ref(1);  
      
        const currentItemId = ref(null);
        const selectTier = ref('I');
        const currentChance = ref(0);
        const valksCry = ref(0);
        const permaChance = ref(0);
        const permaEnhActive = ref(null);

        const regionStore = useRegionStore();  
        const isEditing = ref(false);  
        const dropdownRef = ref(null);  
        const allItems = ref(allItemsData);  
        const searchTerm = ref('');  
        const { wrapRequest } = useLoading()

        const resultItemOverlay = ref(null);
         
        let initialItem = allItems.value[0];

        const selectedItem = ref(initialItem);  
        
        const closeDropdown = () => {  
          isEditing.value = false;  
        };  
          
        const selectItem = (item) =>{  
          selectedItem.value = item;  
          closeDropdown();  
        };  
        
        const handleClickOutside = (event) => {  
          if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {  
            closeDropdown();  
          }  
        };      
        
        onMounted(async () => {  
          document.addEventListener('click', handleClickOutside); 
          wrapRequest(getSuccessRateAndData());
          await wrapRequest(getEnhanceableItems());
          await wrapRequest(loadSimulatorState());
        });  
        
        onUnmounted(() => {  
          document.removeEventListener('click', handleClickOutside);  
          if(resultItemOverlay.value){
            resultItemOverlay.value.removeEventListener('wheel', handleTierScroll);
          }
        });
        onBeforeUnmount(() => {
          saveSimulatorState();
        });

        
        const filteredItems = computed(()=>{  
          if(!searchTerm.value) return allItems.value;  
          return allItems.value.filter(item =>   
            item.text.toLowerCase().includes(searchTerm.value.toLowerCase())  
          );  
        });  

        const currentChanceTotal = computed(() => {
          if (currentChance.value + permaChance.value + valksCry.value >= 100000000000000000000) {
            return 1 + valksCry.value + permaChance.value;
          }
          return currentChance.value + permaChance.value + valksCry.value;
        });

        const reversedLevels = computed(() => {
          const levels = [];
          for (let i = 15; i >= 1; i--){
            levels.push(i);
          }
          return levels;
        });

        function currentChanceMinus(){
          if (currentChance.value >= 1){
            currentChance.value -= 1;
          }
        }
        function selectCurrentIcon(icon, color, itemId,item){
          currentIconUrl.value = icon;
          currentColor.value = color || '#8a63d2';
          currentItemId.value = itemId;
          currentItem.value = item;
        }        
        function limitCurrentChance(){
          if (currentChance.value > 100000000000000000000){
            currentChance.value = 0;
          }
          if (currentChance.value <= 0){
            currentChance.value = 0;
          }
        }

        function selectPermaEnchantButton(number){
          permaEnhActive.value = permaEnhActive.value === number ? null : number;
          permaChance.value = number;
        }
        function tierChange(){
          showResult.value = false;
          const tierMap = {'I':1,'II': 2,"III":3, "IV":4, "V":5, "VI":6, "VII":7, "VIII":8, "IX":9};
          selectTierNumber.value = tierMap[selectTier.value] || selectTier.value;
        }
        function valksPlus(){
          if (valksCry.value === 13){
            valksCry.value = 13;
          }else{
            valksCry.value += 1;
          }
        } 
        function valksMinus(){
          if (valksCry.value != 0){
            valksCry.value -= 1;
          }else{
            valksCry.value += 0;
          }
        }  
        function limitValks(){
          if (valksCry.value >= 13){
            valksCry.value = 13;
          }
          if (valksCry.value <= 0){
            valksCry.value = 0;
          }
        }    
        function currentChancePlus(){
          if (currentChance.value <= 99981){
            currentChance.value += 1
          }
        }
        function limitModalValks(){
          if (modalVaksCry.value >= 13){
            modalVaksCry.value = 13;
          }
          if (modalVaksCry.value <= 0){
            modalVaksCry.value = 0;
          }
        }        
        async function stackOptimizer(){
          clearTimeout(optimizerDebounce.value);
          optimizerDebounce.value = setTimeout(async () =>{
            try{          
              modalError.value = false;
              if(optimizeStackbase.value < 100){
                modalError.value = true;
                errorMessage.value = "Starting failstack must be at least 100.";
                return
              }else if(optimizeStackbase.value > 300){
                modalError.value = true;
                errorMessage.value = "Starting failstack cannot exceed 300.";
                showLog.value = false;
                return;
              }       
              if (modalCurrentItem.value === 'Armors' && modalTier.value > 4){
                modalError.value = true;
                errorMessage.value = "Invalid Tier for Fallen Gods Armors. Maximum Tier is TET (IV).";
                return;
              }
              modalLoading.value = true;
              const response = await apiClient.get(`/fs-optimizer?tier=${modalTier.value}&baseChance=${optimizeStackbase.value}&valks=${modalVaksCry.value}&stacks=${modalPermaEnhanceValue.value}&item=${modalCurrentItem.value}&region=${regionStore.selectedRegion.label}`);
              if(response.data.result.overstackWarning){
                modalError.value = true;
                showLog.value = false;
                errorMessage.value = response.data.result.overstackWarning;
                modalLoading.value = false;
                return;
              }
              modalOptimizeStackbase.value = response.data.result.optimalBaseFailstack;
              modalOptimizeStackTotal.value = response.data.result.optimalTotalFailstack;
              log.value = response.data.result.log || [];
              modalTotalSaveCost.value = response.data.result.totalSaveCost;
              modalLoading.value = false;
            }catch(error){
              modalError.value = true;
              errorMessage.value = "An error occurred while calculating the stack. Please try again."; 
              modalLoading.value = false;
            }          
          }, 500);
        }                
        async function getSuccessRateAndData(){
          isLoading.value = true;
          try{
            const encondedTierNumber = encodeURIComponent(selectTierNumber.value);
            const response = await apiClient.get(`/get-success-rate-and-data?tier=${encondedTierNumber}&stack=${currentChanceTotal.value}&itemId=${currentItemId.value}`);
            const chance = response.data.result.chance || 0;
            successRate.value = chance.toFixed(3);
            crons.value = response.data.result.crons;
            profileKey.value = response.data.result.profileKey;
            durabilityLoss.value = response.data.result.durabilityLoss;
            softcap.value = response.data.result.softcap;
            AverageAtmps.value = (100/(chance)).toFixed(2);
            leftPanelChance.value = chance;
            blackstoneIcon.value = (response.data.result.blackstoneIcon && response.data.result.blackstoneIcon.length > 0)   
            ? response.data.result.blackstoneIcon   
            : currentIconUrl.value ? currentIconUrl.value : defaultIcon;

          }catch(error){
            console.error("Error fetching success rate:", error);
            successRate.value = 0;
            AverageAtmps.value = 0;
            durabilityLoss.value = 0;
            softcap.value = 0;
          } finally {
            nextTick(()=>{
              isLoading.value = false;
            })
          }
        }
        function hideModal(){
          showModal.value = false;
        }
        function showModalBestStack(){
          if(permaEnhActive.value != null){
            modalPermaEnhanceValue.value = permaEnhActive.value;
          }
          modalVaksCry.value = valksCry.value;
          showModal.value = true;
        } 
        function changeModalTier(tier){
          modalTier.value = tier.target.value;
          stackOptimizer();
        } 
        function changeModalicon(icon){
          if(modalTier.value === '2' && icon.target.value != 'Armors'){
            modalTier.value = 3; 
          }
          const selectIcon = icon.target.value;
          const iconMap = {
            'Sovereign': sovereignIcon,
            'Kharazad': kharazadIcon,
            'Armors': labreskaIcon
          };
          modalCurrentItem.value = selectIcon;
          modalIcon.value = iconMap[selectIcon] || sovereignIcon;
        }  
        function limitModalStartingStack(){
          if (modalOptimizeStackbase.value > 300){
            modalOptimizeStackbase.value = 300;
          }
          if (modalOptimizeStackbase.value <= 0){
            modalOptimizeStackbase.value = 100;
          }
        }        

        function formatModalSaveCost(value){
          if (isNaN(value)|| value === null || value === undefined){
            return null;
          }
          if (Math.abs(value) >= 1000000000000){
            return (value /1000000000000).toFixed(2) + ' T';
          }
          if (Math.abs(value) >= 1000000000){
            return (value / 1000000000).toFixed(2) + ' B';
        }
          if (Math.abs(value) >= 1000000){
            return (value / 1000000).toFixed(1) + ' M';
          }
          if (Math.abs(value) >= 1000){
            return (value / 1000).toFixed(1) + ' K';
          }
          return value.toString();
        }        
        
        function handleTierScroll(event){
          event.preventDefault();
          clearTimeout(scrollDebounceTimer.value)
          
          scrollDebounceTimer.value = setTimeout(() => {
            const selectEl = document.getElementById('tier-select');
            if(!selectEl) return;
            const options = Array.from(selectEl.options);
            const currentIndex = selectEl.selectedIndex;
            const direction = event.deltaY > 0 ? 1 : -1;

            let newIndex = currentIndex + direction;

            if (newIndex < 0){
              newIndex = 0;
            }
            if (newIndex >= options.length){
              newIndex = options.length - 1;
            }
            selectTier.value = options[newIndex].value;            
          }, 10);

        }

        async function getEnhanceableItems(){
          try{
            const response = await apiClient.get('/enhanceable-items');
            allItems.value = response.data.items;
          }catch(error){
            console.error("Error fetching enhanceable items:", error);
            return
          }
        }
        async function saveSimulatorState(){
          try{
            const response = await apiClient.post('/simulator-state', {
              enhanceable_item_id: selectedItem.value.id,
              tier: selectTier.value,
              base_failstack: currentChance.value,
              valks_cry: valksCry.value,
              perm_enh_chance: permaChance.value
            });
            console.log("Simulator state saved:", response.data);
          }catch(error){
            console.error("Error saving simulator state:", error);
            return
          }
        }
        async function loadSimulatorState(){
          try{
            const response = await apiClient.get('/simulator-state');
            const state = response.data.state;
            if(state){
              const itemToLoad = allItems.value.find(item => item.id === state.enhanceable_item_id);
              if(itemToLoad){
                selectedItem.value = itemToLoad;
              }
              selectTier.value = state.tier;
              currentChance.value = state.base_failstack;
              valksCry.value = state.valks_cry;
              permaChance.value = state.perm_enh_chance;
              if(permaChance.value != null){
                permaEnhActive.value = permaChance.value;
              }
            }
          }catch(error){
            console.error("Error loading simulator state:", error);
            return
          }
        }
        function debouncedSaveState() {   
          clearTimeout(saveStateDebounceTimer.value);  
          saveStateDebounceTimer.value = setTimeout(() => {  
            saveSimulatorState();
          }, 500);
        }        

        watch(isLoading, (loading) => {  
          if (loading === false) {  
            nextTick(() => {  
              if (resultItemOverlay.value) {  
                resultItemOverlay.value.addEventListener('wheel', handleTierScroll);  
              }  
            });  
          }  
        }); 
        watch(selectedItem, (newItem) =>{
          if(newItem && newItem.id){
            profileKey.value = newItem.id;
            selectCurrentIcon(newItem.icon, newItem.colorClass, newItem.id, newItem.text);
          }
        }, { immediate: true });  
        watch(selectTier, () => {
          tierChange();
          debouncedSaveState();
        });
        watch(selectTierNumber, () => {
          getSuccessRateAndData();
        });
        watch(profileKey, () => {
          const penToIxTiers = ['IX', 'VIII', 'VII', 'VI', 'V', 'IV', 'III', 'II', 'I'];
          const normalTiers = ['IV', 'III', 'II', 'I', '0'];
          const plusTiers = reversedLevels.value.map(l => `+${l}`).concat(['+0']);
          let validTiers = [];
          if (profileKeyPEN.value.includes(profileKey.value)) {
            validTiers = penToIxTiers;
          } else if (profileKeys.value.includes(profileKey.value)) {
            validTiers = normalTiers;
            getSuccessRateAndData();
          } else {
            validTiers = normalTiers;
            validTiers.push(...plusTiers);
          }
        if(!validTiers.includes(selectTier.value)){
            selectTier.value = validTiers[0];
          }
        }          
        )
        watch(currentChanceTotal, () => {
          debouncedSaveState();
          getSuccessRateAndData();
        })        
        return {  
          isEditing,  
          allItems,  
          selectedItem,
          searchTerm,  
          dropdownRef,  
          selectItem,  
          filteredItems,  
          regionStore,
          wrapRequest,
          currentItemId,
          selectTier,
          currentChance,
          valksCry,
          permaChance,
          permaEnhActive,
          tierChange,
          showResult,
          selectTierNumber,
          selectPermaEnchantButton,
          valksPlus,
          valksMinus,
          limitValks,
          currentChancePlus,
          currentChanceMinus,
          limitCurrentChance,
          stackOptimizer,
          modalCurrentItem, modalTier, modalVaksCry, modalPermaEnhanceValue, modalError, modalLoading, modalOptimizeStackbase, modalOptimizeStackTotal,
          modalTotalSaveCost, log, errorMessage, optimizeStackbase, showLog, showModal, modalIcon,
          getSuccessRateAndData,
          isLoading, successRate, essence, crons, profileKey, durabilityLoss, softcap, AverageAtmps, leftPanelChance, blackstoneIcon,
          selectCurrentIcon,
          currentIconUrl, currentColor, currentItem,
          hideModal,
          showModalBestStack,
          changeModalTier,
          changeModalicon,
          limitModalValks, limitModalStartingStack, formatModalSaveCost,
          handleTierScroll, debouncedSaveState,
          resultItemOverlay, currentChanceTotal, reversedLevels,
          profileKeyPEN, profileKeys
        }  
      }
}
</script>

<style>
.page-header {  
  display: flex;  
  justify-content: space-between;  
  align-items: center;  
  padding: 1rem;
  margin-bottom: 0.75rem;   
}

  .optimizer-page {
    background-color: #0e0f11;
    color: #e2e8f0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .title.is-4 {
    color: #fff
  }
  .main-content {
    display: grid;
    grid-template-columns: 1fr 3fr;
    width: 50%;
    gap: 1rem;
    max-width: 1400px;
    margin: 1rem auto 0;
    margin-top: 0;
  }
  .card {
    background-color: #14161a;;
    display: flex;
    width: 100%;
    max-width: none;
    border-radius: 12px;
    box-shadow: none !important;
    min-height: auto;
    color: #e2e8f0;
  }
  .card .card-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
  }
  .top-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }
  .weapon-container {
    position: relative;
    width: 50px;
    height: 50px;
  }
  .sovereign-img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    display: block;
  }
  .Tier {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.3rem;
    font-weight: bold;
    color: #e2e8f0;
    -webkit-text-stroke: 1px #f56565;
  }
  .select select {
    background-color: #12161b;
    color: #e2e8f0;
    border-color: #3e4753;
  }
  .select select:hover {
    border-color: #718096;
  }
  .select:not(.is-multiple)::after {
    border-color: #a0aec0;
  }
  #enchant_diagram {
    position:relative;
    margin: 1rem 0;
    width: 95%;
    max-width: 750px;
    max-height: 400px;
    align-self: center;
  }
  #diagram-background-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .diagram-overlay{
    position: absolute;
    transform: translate(-50%, -50%);
  }
  #cron-overlay{
    top: 13.1%;
    left: 5.9%;
    width: 9%;
    height: 20%;
  }
  #blackstone-overlay{
    top: 61%;
    right: 85%;
    width: 9%;
    height: 20%;
  }
  #chance-overlay{
    top: 60%;
    left: 50%;
    color: #fff;
    font-size: 140%;
    font-weight: bold;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  }
  #result-item-overlay{
    position: absolute;
    top: 61.1%;
    left: 80.8%;
    transform: translate(-50%, -50%);
    width: 8%;
    height: 18.4%;
  }
  .diagram-icon-container .diagram-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  #result-item-overlay .sovereign-img {
    border-radius: 0;
  }

  #enchant-stats {
    margin: 1rem 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 1rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .stat-icon {
    flex-shrink: 0;
  }

  .stat-label {
    color: #c1c9d4;
  }

  .stat-controls .input {
    width: 60px;
    background-color: #12161b;
    border-color: #3e4753;
    color: #e2e8f0;
    text-align: right;
    font-size: 0.9rem;
  }

  .stat-controls .button {
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .stat-controls .button.is-success {
    background-color: #38a169;
    border-color: #2f855a;
    color: #fff;
  }
  .stat-controls input[type=number]::-webkit-outer-spin-button,
  .stat-controls input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .stat-controls input[type=number] {
    -moz-appearance: textfield;
  }
  .dropdown-trigger {
    min-width: 200px;
  }
  .dropdown-trigger .button {
    background-color: #12161b;
    border-color: #3e4753;
    color: #e2e8f0;
    box-shadow: none;

    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .dropdown-trigger .button:hover {
    border-color: #718096;
  }
  .button-label-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .dropdown-trigger .button .icon {
    color: #5a7ff2;
  }
  .css-arrow {
    border: solid #5a80f2de;
    border-width: 0 2px 2px 0; 
    display: inline-block;
    padding: 4px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    margin-right: 5px;
    transition: transoform 0.2seg ease-in-out;
  }
  .dropdown-item-icon{
    width: 28px;
    height: 28px;
    margin-right: 0.75rem;
    border-radius: 3px;
    flex-shrink: 0;
    vertical-align: middle;
  }
  .dropdown-item{
    display: flex;
    align-items: center;
    vertical-align: middle;
  }
  .control{
    position: relative;
  }
  .control.has-icon-right .input{
    padding-right: 2.5rem;
  }
  .input-arrow-icon {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #5a80f2;
  }
  .dropdown.is-active .css-arrow {
    transform: translateY(-2px) rotate(-135deg);
    -webkit-transform: translateY(-2px) rotate(-135deg);
  }  
  .top-row .dropdown {
    flex-grow: 1;
    margin: 0 1rem;
  }
  .dropdown .dropdown-trigger,
  .dropdown .dropdown-menu {
    width: 100%;
  }
  .dropdown-item {
    padding: 0.75rem 1.25rem; 
    font-size: 1.1rem; 
  }
  .dropdown-item-icon {
    width: 32px;
    height: 32px;
  }
  .stat-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .stat-controls.buttons {
    flex-wrap: nowrap;
  }
  .cron-amount-text{
    position: absolute;
    top: 80%;
    left: 65%;
    text-align: center;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1.1rem;
    -webkit-text-stroke-width: 0.1px;
    -webkit-text-stroke-color: #000;
    text-shadow:
        1px 1px 0 #000,
      -1px -1px 0 #000,  
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;    
  }
  .essence-amount-text{
    position: absolute;
    top: 80%;
    left: 80%;
    text-align: center;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 1.1rem;
    -webkit-text-stroke-width: 0.1px;
    -webkit-text-stroke-color: #000;
    text-shadow:
        1px 1px 0 #000,
      -1px -1px 0 #000,  
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;    
  }
  .modal-button{
    justify-content: flex-end;
    background-color: #4a5568
  }
  .modal-form-row {  
    display: flex;
    gap: 1rem; 
    align-items: baseline;
  }  
    
  .modal-form-row .field {  
    flex: 1;  
  }  
    
  .modal-form-row .field {  
    margin-bottom: 0;  
  }  
  .modal-card-body .field:not(:first-child) {  
      margin-top: 0.75rem;  
  }  
  #modal-tier-select{
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .modal-card.is-wide-modal {
    width: 60%;
    max-width: 800px;
  }
  .dropdown-content {  
    max-height: 400px;
    overflow-y: auto;  
  }
  #enchant-stats .stat-controls .input.is-small {  
  height: 30px;  
}  
</style>