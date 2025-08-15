<template>
  <div>    
    <h4 class="title is-4" id="titulo">Enhancing Sovereign Optimizer</h4>    
    <div class="Enhanching">
        <div class="card">
          <div class="card-content">
              <div class="content">
                <div class="weapon-container">
                  <img src="../assets/Base.jpg" alt="sovereign weapon" class="sovereign-img">
                  <span class="Tier text-lg">{{ selectTier }}</span>
                </div>
              <div class="select" id="select-content">                   
                <select id="tier-select" @change="tierChange($event)" >
                    <option value="III">TRI (III)</option>
                    <option value="IV">TET (IV)</option>
                    <option value="V">PEN (V)</option>
                    <option value="VI">HEX (VI)</option>
                    <option value="VII">SEP (VII)</option>
                    <option value="VIII">OCT (VIII)</option>
                    <option value="IX">ENE (IX)</option>
                    <option value="X">DEC (X)</option>
                </select>
                </div>
              <div id="enchant-icons">
                <figure class="image is-24x24">
                  <img src="../assets/adicional-enhanment-chance.png"/>
                  <img src="../assets/valkscry.png" id="enchant-icon" />
                  <img src="../assets/adicional-enhanment-chance.png" id="enchant-icon" />
                  <img src="../assets/current-enhancement-chance.png" id="current-chance-icon">
                </figure>
              </div>
              <div id="text-enchant">
                <p><b>Additional Enhancement Chance</b></p>
                <p><b>Valk's Cry</b></p>
                <p><b>Permanent Enhancement Chance</b></p>
                <p><b>Current Enhancement Chance</b></p>
              </div>  
              <div id="current-chance">
                <div id="chance-plus">
                  <h5 class="subtitle is-5">+</h5>
                </div>
                <div id="total-stack">
                  <h5 class="subtitle is-5">{{ currentChanceTotal }}</h5>
                </div>
              </div> 
              <div id="perma-enchant">
                <button @click = 'selectPermaEnchantButton(0)' class="button" :class="{ 'is-success': permaEnhActive === 0 }">+0</button>
                <button @click = 'selectPermaEnchantButton(1)' class="button" :class="{ 'is-success': permaEnhActive === 1 }">+1</button>
                <button @click = 'selectPermaEnchantButton(2)' class="button" :class="{ 'is-success': permaEnhActive === 2 }">+2</button>
                <button @click = 'selectPermaEnchantButton(3)' class="button" :class="{ 'is-success': permaEnhActive === 3 }">+3</button>
                <button @click = 'selectPermaEnchantButton(4)' class="button" :class="{ 'is-success': permaEnhActive === 4 }">+4</button>
                <button @click = 'selectPermaEnchantButton(5)' class="button" :class="{ 'is-success': permaEnhActive === 5 }">+5</button>
              </div>   
              <div id="valks-cry">
                <h6 class="subtitle is-6" id="valks-text">+</h6>
                <input
                  class="input is-small"
                  type="name"
                  v-model.number = "valksCry"
                  @input="limitValks"
                  id="valks-cry-input"
                />
                <button class="button" @click="valksPlus()" id="button-valks">+</button>
                <button class="button" @click="valksMinus()" id="button-valks">-</button>
              </div>      
              <div id="failstack">
                <h6 class="subtitle is-6" id="fs-text">+</h6>
                <input
                  class="input is-small"
                  type="name"
                  v-model.number = "currentChance"
                  @input="limitCurrentChance"
                  placeholder="0"
                  id="fs-input"
                /> 
                <button class="button" @click="currentChancePlus" id="button-valks">+</button>
                <button class="button" @click="currentChanceMinus" id="button-valks">-</button>               
              </div>    
              <div id="confirm-button">
                <button class="button is-success" @click="stackOptimizer">Otimizar</button>
              </div>
              </div>
        </div>
    </div>
    </div>   

  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'fsSovereignOptimizerView',
    data(){
      return {
        selectTier: 'III',
        permaChance: 0,
        currentChance: 0,
        permaEnhActive: null,
        valksCry: 0,
        calculator: 0,
      }
    },
    methods: {
      tierChange(event){
        this.selectTier = event.target.value;
      },
      selectPermaEnchantButton(number){
        this.permaEnhActive = this.permaEnhActive === number ? null : number;
        this.permaChance = number;
      },
      valksPlus(){
        if (this.valksCry === 13){
          this.valksCry = 13;
        }else{
          this.valksCry += 1;
        }
      },
      valksMinus(){
        if (this.valksCry != 0){
          this.valksCry -= 1;
        }else{
          this.valksCry += 0;
        }
        
      },
      limitValks(){
        if (this.valksCry >= 13){
          this.valksCry = 13;
        }
        if (this.valksCry <= 0){
          this.valksCry = 0;
        }
      },
      currentChancePlus(){
        if (this.currentChance <= 99981){
          this.currentChance += 1
        }
      },
      currentChanceMinus(){
        if (this.currentChance >= 1){
          this.currentChance -= 1;
        }
      },
      limitCurrentChance(){
        if (this.currentChance >= 99981){
          this.currentChance = 99981;
        }
        if (this.currentChance <= 0){
          this.currentChance = 0;
        }
      },
      async stackOptimizer(){
        axios.get('http://localhost:8585/fs-optimizer?tier=6&baseChance=100&valks=13&stacks=2').then(res =>{
          console.log(res);
        }).then(err=>{
          console.log(err);
        })
      }
    },
    computed:{
      currentChanceTotal(){
        return this.currentChance + this.permaChance + this.valksCry;
      },
    }
}
</script>

<style>
.card{
    margin: 0 auto;
    margin-top: 4%;
    width: 51%;
    display: flex;
    min-height: 500px;
}
#titulo{
    margin-top: 2%;
    margin-left: 4%;
}
.content{
    display: inline-block;
}
.card-content{
  width: 100%;
  height: 100%;
}
.sovereign-img{
  position: absolute;
  top: 45px;       /* Distância do topo */
  left: 75px;      /* Distância da esquerda */  /* Valor negativo para inclinar para esquerda */
  transform-origin: left top; /* Ponto de rotação no canto superior esquerdo */
  object-fit: contain;
  border-style: solid ;
  border-radius:5px;
  border-color: rgb(159 122 234);
}
.text-lg {
  align-items: center !important;
  height: 50px;
  width: 50px;
}
.Tier {
  display: inline-flex;   
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  -webkit-text-stroke: 1px #f56565;
  font-size: 1.5rem;      
  margin-left: 51px;
  position: absolute;
}  

#select-content {
  position: absolute;
  right: 5px;
  top: 50px;
}
#enchant-icons{
  position: absolute;
  left: 76px;
  bottom: 65%;
}
#enchant-icon{
  margin-top: 15px;
}
#text-enchant{
  position: absolute;
  bottom: 40%;
  left: 110px;
}
#current-chance-icon{
  margin-top: 20px;
}
#current-chance{
  position: absolute;
  right: 29px;
  bottom: 40.2%;
  width: 130px;
  height: 25px;
  display: flex;
}
#chance-plus{
  width: 50%;
  height: 100%;
  text-align: right;
  margin-right: 4px;
}
#total-chance{
  width: 50%;
  height: 100%;
}
#perma-enchant{
  position: absolute;
  right: 210px;
  bottom: 48%;
  width: 100px;
  height: 25px;
  display: flex;
}
#total-stack{
  min-width: 60px;
  text-align: left;
}
#valks-cry{
  position: absolute;
  right: 5px;
  bottom: 55%;
  width: 140px;
  height: 30px;
  display: flex;
}
#valks-cry-input{
  height: 100%;
  width:50%;
  align-content: right;
  text-align: right;
  margin-right: 5px;
}
#button-valks{
  height: 100%;
  width:21%;
  align-content: right;
}
#valks-text{
  margin-top: 4px;
  margin-right: 5px;
}
#failstack{
  position: absolute;
  right: 5px;
  bottom: 62%;
  width: 140px;
  height: 30px;
  display: flex;
}
#fs-input{
  height: 100%;
  width:50%;
  align-content: right;
  text-align: right;
  margin-right: 5px;
}
#fs-text{
  margin-top: 4px;
  margin-right: 5px;
}
#confirm-button{
  position: absolute;
  top: 70%;
  left: 75px;
}
</style>