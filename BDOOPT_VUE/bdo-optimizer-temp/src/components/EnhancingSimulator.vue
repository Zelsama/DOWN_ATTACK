<template>
  <div class="simulator-panel">
    <div class="simulator-controls">
      <div class="input-group">
        <input 
          type="number" 
          v-model.number="repetitions" 
          @input="limitRepetitions"
          placeholder="1000" 
          class="attempts-input"
        >
        <button class="button is-success" @click="runSimulation">Enhance</button>
        <button class="button" @click="clearLog">Clear</button>
      </div>
    </div>
    <div class="log-container">
      <ul class="log-list">
        <li v-for="(entry, index) in log" :key="index" class="is-align-items-center" :class="entry.success ? 'log-success' : 'log-fail'">
          {{ entry.message }}
        </li>
      </ul>
    </div>
    <div class="results-display">
      <div class="result-box">
        <span class="result-label">Success</span>
        <span class="result-value has-text-success">{{ successCount }}</span>
      </div>
      <div class="result-box">
        <span class="result-label">Fails</span>
        <span class="result-value has-text-danger">{{ failCount }}</span>
      </div>
      <div class="result-box">
        <span clas="result-label">Avg. Attempts</span>
        <span class="result-value">{{ averageAttempts }}</span>
      </div>
      <div class="result-box">
        <span clas="result-label">Attempts</span>
        <span class="result-value">{{ failCount + successCount }}</span>
      </div>
    </div>    
  </div>
</template>

<script>
export default {
    name: 'EnhancingSimulatorComponent',
    props: {
        baseSuccessRate: {
            type: [Number, String],
            required: true,
            default: 0
        }
    },
    data() {
        return {
            repetitions: 1,
            successCount: 0,
            failCount: 0,
            log: [],
        }
    },
    methods: {
        runSimulation(){
            if (!this.repetitions || this.repetitions <= 0) return;
            const rate = parseFloat(this.baseSuccessRate) / 100;

            for (let i = 0; i < this.repetitions; i++) {
                const prizeDraw = Math.random();
                const isSuccess = prizeDraw < rate;
                if (isSuccess) {
                    this.successCount++;
                    this.log.push({ success: true, message: `Success: ${(prizeDraw * 100).toFixed(3)}` });
                } else {
                    this.failCount++;
                    this.log.push({ success: false, message: `Failed: ${(prizeDraw * 100).toFixed(3)}` });
                }
            }
        },
        clearLog() {
            this.log = [];
            this.successCount = 0;
            this.failCount = 0;
        },
        limitRepetitions() {
            if (this.repetitions > 1000) {
                this.repetitions = 1000;
            }
            if (this.repetitions < 1) {
                this.repetitions = 1;
            }
        }
    },
    computed: {
        averageAttempts() {
            const totalAttempts = this.successCount + this.failCount;
            if (totalAttempts === 0) return 0;
            if ((totalAttempts / this.successCount) === Infinity) {return 0;}else{return (totalAttempts / this.successCount).toFixed(2);}
        }
    }
}
</script>

<style scoped>
.simulator-panel {
    background-color: hsl(221,14%,9%);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: #e2e8f0;
}

.simulator-controls {
    display: flex;
    justify-content: center;
}

.input-group {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.attempts-input {
    width: 80px;
    background-color: #0e0f11;
    border: 1px solid #3e4753;
    color: #e2e8f0;
    border-radius: 6px;
    padding: 0.5rem;
    text-align: center;
}

.results-display {
    display: flex;
    justify-content: space-around;
    background-color: #0e0f11;
    padding: 0.75rem;
    border-radius: 8px;
}

.result-box {
    text-align: center;
}

.result-label {
    color: #a0aec0;
    font-size: 0.9rem;
}

.result-value {
    display: block;
    font-size: 1.5rem;
    font-weight: bold;
}

.log-container {
    background-color: #0e0f11;
    border-radius: 8px;
    padding: 1rem;
    height: 200px;
    overflow-y: auto;
    border: 1px solid #3e4753;
}

.log-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-family: monospace;
    text-align: center;
}

.log-success {
    color: #48bb78; /* Verde */
}

.log-fail {
    color: #f56565; /* Vermelho */
}
.attempts-input::-webkit-outer-spin-button,  
.attempts-input::-webkit-inner-spin-button {  
  -webkit-appearance: none;  
  margin: 0;  
}  
  
.attempts-input[type=number] {  
  -moz-appearance: textfield;  
}
</style>