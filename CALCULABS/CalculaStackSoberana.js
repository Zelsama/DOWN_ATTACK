import axios from "axios";

const api = axios.create({
    baseURL: 'https://api.arsha.io/v2'
}
)



class CalculaStackSoberana{
    constructor(region){
        this.region = region;
        this.cron = 3000000;
        this.valksCry = 0;
        this.permanentChance = 0;
        this.darkHunger = null;
        this.faintDarkHunger = null;
        this.tierData = {
        3: {   // TRI
            baseChance: 0.910,   // Chance base (9.1%)
            fsMultiplier: 0.091, // Incremento por failstack (0.091% por FS)
            crons: 780           // Crons por tentativa
        },
        4: {   // TET
            baseChance: 0.469,   // 4.69%
            fsMultiplier: 0.0469, // 0.0469% por FS
            crons: 970
        },
        5: {   // PEN
            baseChance: 0.273,   // 2.73%
            fsMultiplier: 0.0273, // 0.027% por FS
            crons: 1350
        },
        6: {   // HEX
            baseChance: 0.160,   // 1.60%
            fsMultiplier: 0.016, // 0.016% por FS
            crons: 1550
        },
        7: {   // HEP
            baseChance: 0.1075,   // 1.075%
            fsMultiplier: 0.01075, // 0.01075% por FS
            crons: 2250
        },
        8: {   // OCT
            baseChance: 0.0485,   // 0.485%
            fsMultiplier: 0.00485, // 0.004% por FS
            crons: 2760
        },
        9: {   // ENE
            baseChance: 0.0242,   // 0.242%
            fsMultiplier: 0.00242, // 0.00242% por FS
            crons: 3920
        }
        };
    }
    async initialize() {
        try {
            const [darkHungerData, faintDarkhunterData] = await Promise.all([
                this.GetItemPrice(65319),
                this.GetItemPrice(767102)
            ]);
            this.darkHunger = darkHungerData.lastSoldPrice;
            this.faintDarkHunger = faintDarkhunterData.lastSoldPrice;
        } catch (error) {
            console.error("Erro ao carregar preço do Dark Hunger:", error);
            throw new Error("Não foi possível inicializar os preços");
        }
    }

    static async create(region) {
        const instance = new CalculaStackSoberana(region);
        await instance.initialize();
        return instance;
    }
    validateInitialStack(fs){
        const failstack = Number(fs);
        return Number.isInteger(failstack) && failstack >=100 && failstack <= 299;
    }

    validateTier(tier) {
        const number = Number(tier);
        return Number.isInteger(number) && number >= 3 && number <= 9;
    }
    setFailstackComponents(base, valks = 0, diary = 0) {
        if (valks < 0 || valks > 13) throw new Error("Gritos de Valk devem ser entre 0-13");
        if (diary < 0 || diary > 5) throw new Error("Bônus do diário deve ser entre 0-5");
        
        this.validateInitialStack(base); // Valida o base como antes
        this.currentBase = base;
        this.valksScream = valks;
        this.diaryBonus = diary;
    }
    
    getTotalFailstack() {
        return this.currentBase + this.valksScream + this.diaryBonus;
    }

    getSucessRate(tier, failstack){
        const {baseChance: chanceBase, fsMultiplier: multiplierFs} = this.tierData[tier] || {};
        if (!chanceBase || !multiplierFs) throw new Error("Tier Inválido");

        const chance = (failstack * multiplierFs) + chanceBase;
        return Math.min(chance, 90);
    }
    async GetItemPrice(itemID){
        try{
            const response = await api.get(`/${this.region}/item?id=${itemID}`)
            return response.data;
        }catch(error){
            throw error;
        }
    }
    FaintDarkHunterSheet(failstack){
        if (failstack >= 300) return failstack;
        if (failstack >= 299) return failstack + 1;
        if (failstack >= 268) return failstack + 2;
        if (failstack >= 229) return failstack + 3;
        if (failstack >= 206) return failstack + 4;
        if (failstack >= 180) return failstack + 5;
        if (failstack >= 164) return failstack + 6;
        if (failstack >= 147) return failstack + 7;
        if (failstack >= 135) return failstack + 8;
        if (failstack >= 125) return failstack + 9;
        if (failstack >= 118) return failstack + 10;
        if (failstack >= 110) return failstack + 11;
        if (failstack >= 105) return failstack + 12;
        if (failstack >= 100) return failstack + 13;
        return failstack;
    }

    DarkHungerSheet(failstack){
        if (failstack >= 300) return failstack;
        if (failstack >= 299) return failstack + 1;
        if (failstack >= 298) return failstack + 2;
        if (failstack >= 297) return failstack + 3;
        if (failstack >= 292) return failstack + 4;
        if (failstack >= 270) return failstack + 5;
        if (failstack >= 255) return failstack + 6;
        if (failstack >= 236) return failstack + 7;
        if (failstack >= 218) return failstack + 8;
        if (failstack >= 207) return failstack + 9;
        if (failstack >= 197) return failstack + 10;
        if (failstack >= 188) return failstack + 11;
        if (failstack >= 176) return failstack + 12;
        if (failstack >= 166) return failstack + 13;
        if (failstack >= 157) return failstack + 14;
        if (failstack >= 149) return failstack + 15;
        if (failstack >= 142) return failstack + 16;
        if (failstack >= 136) return failstack + 17;
        if (failstack >= 130) return failstack + 18;
        if (failstack >= 125) return failstack + 19;
        if (failstack >= 120) return failstack + 20;
        if (failstack >= 116) return failstack + 21;
        if (failstack >= 112) return failstack + 22;
        if (failstack >= 109) return failstack + 23;
        if (failstack >= 106) return failstack + 24;
        if (failstack >= 102) return failstack + 25;
        if (failstack >= 100) return failstack + 26;
        return failstack;
    }
    findOptimalStack(tier, initialBaseFs, initialValks = 0, permanentChance = 0){
        if(!this.validateTier(tier)){
            throw new Error("Nível inválido. O nível tem que ser de III a IX");
        }
        if(!this.validateInitialStack(initialBaseFs)){
            throw new Error("Failstack inválido. Deve ser um número inteiro de 100 até 299");
        }
        let currentBase = initialBaseFs;
        let darkHungersUseds = 0;   
        let faintDarkHungerUseds = 0;
        const MAX_ITERATIONS = 1000;
        let iterations = 0;

        while (iterations < MAX_ITERATIONS){
            iterations ++;
            let currentTotalFs = currentBase + initialValks + permanentChance;  
            let currenteChance = this.getSucessRate(tier, currentTotalFs);
            let baseWithDarkHunger = this.DarkHungerSheet(currentBase);
            let totalWithDarkHunger = baseWithDarkHunger + initialValks + permanentChance;

            if (baseWithDarkHunger === currentBase){
                break;
            }
            
            let chanceMoreDarkHunger = this.getSucessRate(tier, totalWithDarkHunger);
            let CurrentAverageAttempts = (100/currenteChance).toFixed(4);
            //console.log("[DEBUG] Chance atual do stack \n", CurrentAverageAttempts);
            let DarkHungerAverageAttempts = (100/chanceMoreDarkHunger).toFixed(4);
            //console.log("[DEBUG] Chance após uso da devoração \n" + DarkHungerAverageAttempts);
            let subtractAverages =CurrentAverageAttempts - DarkHungerAverageAttempts;
            //console.log("[DEBUG] Chance apos a subtração das chances \n" + subtractAverages)
            let costWithCrons = subtractAverages * this.cron * this.tierData[tier].crons;
            //console.log("[DEBUG] Custo da multplicação do preço \n" + costWithCrons.toFixed(1));
            if (costWithCrons > this.darkHunger){
                darkHungersUseds += 1;
                currentBase = baseWithDarkHunger;
            }else{
                const baseWithFaint = this.FaintDarkHunterSheet(currentBase);
                if (baseWithFaint != currentBase){
                    const totalWithFaint = baseWithFaint + initialValks + permanentChance;
                    const faintChance = this.getSucessRate(tier, totalWithFaint);
                    const faintAvgAttemps = (100/faintChance);
                    const faintAttempsSaved = CurrentAverageAttempts - faintAvgAttemps;
                    const faintCostWithCrons = faintAttempsSaved * this.cron * this.tierData[tier].crons;
                    if (faintCostWithCrons > this.faintDarkHunger){
                        faintDarkHungerUseds += 1;
                        currentBase = baseWithFaint;
                    }else{
                        break
                    }
                }

                break;
            }           
        }
        if (currentBase == 300){
            darkHungersUseds = 21;
            faintDarkHungerUseds = 1;
        }
        return {
            optimalBaseFailstack: currentBase,
            optimalTotalFailstack: currentBase + initialValks + permanentChance,
            darkHungersUsed: darkHungersUseds, 
            faintDarkHungerUseds: faintDarkHungerUseds
        };
    }
}   
  

export default CalculaStackSoberana;