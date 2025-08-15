import axios from "axios";
import db from "./database/connection.js";

const api = axios.create({
    baseURL: 'https://api.arsha.io/v2'
}
)



class CalculaStackSoberana{
    constructor(region = 'sa', item = 'Sovereign'){
        this.item = item;
        this.region = region;
        this.cron = 3000000;
        this.valksCry = 0;
        this.permanentChance = 0;
        this.darkHunger = null;
        this.faintDarkHunger = null;
        this.essenceOfDawn = null;
        this.tierData = {
        "Sovereign":{   
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
        },
        "Armors":{
            2: {
                baseChance: 0.5, //0.5%
                fsMultiplier: 0.05, //0,02% per stack
                crons: 2100,
            },
            3: {
                baseChance: 0.2, //0.2%
                fsMultiplier: 0.02, //0.02% por stack
                crons: 2700,
            },
            4: {
                baseChance: 0.003, //0.2%
                fsMultiplier: 0.00025, //0,0002 por stack
                crons: 4000,
            }
        },
        "Kharazad": {
            3: {
                baseChance: 2.89, //2.89%
                fsMultiplier: 0.289, //0.289% por stack
                crons: 540,
                essence: 4
            },
            4: {
                baseChance: 1.91, //1.91%
                fsMultiplier: 0.191,//0.191% por stack
                crons: 840,
                essence: 6
            },
            5: {
                baseChance: 1.29, //1.29%
                fsMultiplier: 0.129, //0.129% por stack
                crons: 1090,
                essence: 8
            },
            6: {
                baseChance: 0.88, //0.88%
                fsMultiplier: 0.088, //0.088% por stack
                crons: 1480,
                essence: 10
            },
            7: {
                baseChance: 0.57, //0.57%
                fsMultiplier: 0.057, //0,057% por stack
                crons: 1880,
                essence: 12
            },
            8: {
                baseChance: 0.32, //0.32%
                fsMultiplier: 0.032, //0.032% por stack
                crons: 2850,
                essence: 15
            },
            9: {
                baseChance: 0.172, //0,172%
                fsMultiplier: 0.0172, //0,172% por stack
                crons: 3650,
                essence: 0
            },
        }

        };
    }
    async initialize() {
        try {
            const [darkHungerData, faintDarkhunterData, essenceOfDawnData] = await Promise.all([
                this.findItemInDb(65319),
                this.findItemInDb(767102),
                this.findItemInDb(820979)
            ]);
            this.darkHunger = darkHungerData?.price || 0;
            this.faintDarkHunger = faintDarkhunterData?.price || 0;
            this.essenceOfDawn = essenceOfDawnData?.price || 0;
        } catch (error) {
            console.error("Erro ao carregar preços no banco de:", error);
            throw new Error("Não foi possível inicializar os preços");
        }
    }

    async findItemInDb(id){
        const findItem = db('item_prices').where({
            item_id: id,
            region: this.region
        }).first();
        return findItem;
    }

    async findItemCrons(tier){
        const itemKey = this.item;
        if (!this.tierData || !this.tierData[itemKey]) {
            throw new Error(`Item ${itemKey} não encontrado na base de dados.`);
        }
        if (!this.tierData[itemKey][tier]) {
            throw new Error(`Tier ${tier} não encontrado para o item ${itemKey}.`);
        }
        const tierInfo = this.tierData[itemKey][tier];
        const result = {Crons: 0, Essence: 0}
        if(itemKey === 'Kharazad' && tierInfo.essence){
            result.Essence = tierInfo.essence;
        }

        if (tierInfo.crons) {
            result.Crons = tierInfo.crons;
        }else {
            throw new Error(`Valor de crons não encontrado para o tier '${tier}`)
        }
        return result;
    }

    static async create(region, item) {
        const instance = new CalculaStackSoberana(region, item);
        await instance.initialize();
        return instance;
    }
    validateInitialStack(fs){
        const failstack = Number(fs);
        return Number.isInteger(failstack) && failstack >=100 && failstack <= 300;
    }

    validateTier(tier) {
        const number = Number(tier);
        if(this.item === 'Sovereign' || this.item === 'Kharazad'){
            return Number.isInteger(number) && number >= 3 && number <= 9;            
        }else{
            return Number.isInteger(number) && number >= 2 && number <= 9;             
        }

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

    getSuccessRate(tier, failstack){
        const {baseChance: chanceBase, fsMultiplier: multiplierFs} = this.tierData[this.item][tier] || {};
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
    /** 
     * auxiliar function for the findOptimalStack();
        @private
    */
    _calculateStack(tier, initialBaseFs, initialValks, permanentChance){
        let currentBase = initialBaseFs;
        let KharazadCost = 0;
        let darkHungersUseds = 0;   
        let faintDarkHungerUseds = 0;
        const MAX_ITERATIONS = 1000;
        let iterations = 0;
        let log = [];
        let totalSaveCost = 0;
        log.push({  
                event: 'Initialization',  
                costs: {  
                    darkHunger: this.darkHunger,  
                    faintDarkHunger: this.faintDarkHunger,  
                    ...(this.item === 'Kharazad' && { essenceOfDawn: this.essenceOfDawn }) 
                }  
            });
        if(this.item === 'Kharazad'){log.push(this.essenceOfDawn)};

        while (iterations < MAX_ITERATIONS){
            iterations ++;

            let currentTotalFs = currentBase + initialValks + permanentChance;  
            let currenteChance = this.getSuccessRate(tier, currentTotalFs);
            let baseWithDarkHunger = this.DarkHungerSheet(currentBase);
            let totalWithDarkHunger = baseWithDarkHunger + initialValks + permanentChance;
            let netProfitDark = -Infinity;

            if (baseWithDarkHunger === currentBase){
                break;
            }
            
            let chanceMoreDarkHunger = this.getSuccessRate(tier, totalWithDarkHunger);
            let CurrentAverageAttempts = (100/currenteChance).toFixed(4);
            let DarkHungerAverageAttempts = (100/chanceMoreDarkHunger).toFixed(4);
            let subtractAverages =CurrentAverageAttempts - DarkHungerAverageAttempts;
            if(this.item === 'Kharazad'){KharazadCost = this.essenceOfDawn * (this.tierData[this.item][tier].essence)};
            let costWithCrons = (subtractAverages * this.cron * this.tierData[this.item][tier].crons) + (subtractAverages * KharazadCost);
            netProfitDark = costWithCrons - this.darkHunger;
            
            const baseWithFaint = this.FaintDarkHunterSheet(currentBase);
            let netProfitFaint = -Infinity;

            if (baseWithFaint === currentBase){break};
            const totalWithFaint = baseWithFaint + initialValks + permanentChance;
            const faintChance = this.getSuccessRate(tier, totalWithFaint);
            const faintAvgAttemps = (100/faintChance);
            const faintAttempsSaved = CurrentAverageAttempts - faintAvgAttemps;            
            const faintCostWithCrons = (faintAttempsSaved * this.cron * this.tierData[this.item][tier].crons) + (faintAttempsSaved * KharazadCost);
            netProfitFaint = faintCostWithCrons - this.faintDarkHunger;
            
            if(netProfitDark > netProfitFaint && netProfitDark > 0){
                log.push({
                    event: 'Analysis',
                    type: 'Dark Hunger',
                    from: { fs: currentTotalFs, avgAttemps: Number(CurrentAverageAttempts).toFixed(3)},
                    to: { fs: totalWithDarkHunger, avgAttemps: Number(DarkHungerAverageAttempts).toFixed(3)},
                    savedAttempts: subtractAverages.toFixed(3),
                    saveCost: ((costWithCrons - this.darkHunger)).toFixed(1)
                });
                totalSaveCost += ((costWithCrons - this.darkHunger))
                log.push({
                    event: "Decision",
                    outcome: 'UsedDarkHunger',
                    reason: `Saved value {${costWithCrons.toFixed(3)}} > Cost (${this.darkHunger})`,
                });
                currentBase = baseWithDarkHunger;
                darkHungersUseds += 1;
            }else if(netProfitFaint > 0){
                log.push({
                    event: 'Analysis',
                    type: 'Faint Dark Hunger',
                    from: { fs: currentTotalFs, avgAttemps: Number(CurrentAverageAttempts).toFixed(3) },
                    to: { fs: totalWithFaint, avgAttemps: faintAvgAttemps.toFixed(3) },
                    savedAttempts: faintAttempsSaved.toFixed(3),
                    saveCost: ((faintCostWithCrons - this.faintDarkHunger)).toFixed(1)
                });       
                log.push({
                    event: "Decision",
                    outcome: 'UsedFaintDarkHunger',
                    reason: `Saved value {${faintCostWithCrons.toFixed(3)}} > Cost (${this.faintDarkHunger})`,
                });                
                totalSaveCost += ((faintCostWithCrons - this.faintDarkHunger)) 
                faintDarkHungerUseds += 1;
                currentBase = baseWithFaint;
            }else{
                log.push({
                    event: "Decision",
                    outcome: 'Stop',
                    reason: `No profitable option found. Dark Profit: ${netProfitDark.toFixed(0)}, Faint Profit: ${netProfitFaint.toFixed(0)}`,
                });
                break;
            }  
            if (currentBase >= 300){break};         
        }
        return {
            optimalBaseFailstack: currentBase,
            optimalTotalFailstack: currentBase + initialValks + permanentChance,
            darkHungersUsed: darkHungersUseds, 
            faintDarkHungerUseds: faintDarkHungerUseds,
            log: log,
            totalSaveCost: totalSaveCost
        };
    }

    findOptimalStack(tier, initialBaseFs, initialValks = 0, permanentChance = 0){
        if(!this.validateTier(tier)){
            throw new Error("Invalid Tier.");
        }
        if(!this.validateInitialStack(initialBaseFs)){
            throw new Error("Invalid Failstack. Starting failstack must be at least 100 and Starting failstack cannot exceed 300.");
        }
        
        const mainResult = this._calculateStack(tier, initialBaseFs, initialValks, permanentChance);
        let overstackWarning = null;

        if (mainResult.optimalBaseFailstack !== initialBaseFs){
            return mainResult;
        }else{
            const baseLineResult = this._calculateStack(tier, 100, initialValks, permanentChance);
            const difference = initialBaseFs - baseLineResult.optimalBaseFailstack;
            if(difference > 10){
                overstackWarning = `Warning: Your starting failstack (${initialBaseFs}) is considered an overstack for this item. The recommended optimal stack starts around ${baseLineResult.optimalBaseFailstack}. You are using approximately ${difference} FS more than necessary.`
            }
        }

        return {
            ...mainResult,
            overstackWarning: overstackWarning
        }
    }
}   
  

export default CalculaStackSoberana;