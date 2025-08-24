import enhancementProfiles from "./data/enhancementProfiles.js";
import itemData from "./data/itemsData.js";
import cronCosts from "./data/cronCosts.js";

const itemMap = new Map(itemData.map(item => [item.id, item]));
const GRADE_MAP = {
    1: 'GREEN',
    2: 'BLUE',
    3: 'YELLOW',
    4: 'ORANGE',
    5: 'PURPLE'
}
const ARMORS_ID = new Set([15]);
const WEAPON_IDS = new Set([1, 10,5]);
const ACCESSORY_ID = new Set([20])

class EnhancementCalculator{
    constructor(itemId){
        this.itemId = itemId;
    }
    getSuccessRateAndData(tier, failstack){
        const item = itemMap.get(this.itemId)
        if (!item){
            return {error: 'Item Id not found.'}
        }
        const {grade_type: itemGrade, main_category: itemCategory} = item;
        let profileKey = '';
        if (this.itemId >= 736015 && this.itemId <= 738222){
            profileKey = `GODR_WEAPON`;
        }else if(WEAPON_IDS.has(itemCategory)){
            profileKey = `${GRADE_MAP[itemGrade]}_WEAPON`
        }else if(ARMORS_ID.has(itemCategory)){
            profileKey = `${GRADE_MAP[itemGrade]}_ARMORS`
        }else if(ACCESSORY_ID.has(itemCategory)){
            profileKey = `${GRADE_MAP[itemGrade]}_ACCESSORIES`
        }else{
            return {error: 'Invalid item category.'};
        }
        const {baseChance: chanceBase, fsMultiplier: multiplierFs, crons: genericCronCost, durabilityLoss: durabilityLoss, softcap: softcap, blackstoneIcon: blackstone } = enhancementProfiles[profileKey][tier] || {};
        const specificCronCost = cronCosts[this.itemId]?.[tier];
        const finalCronCost = specificCronCost ?? genericCronCost ?? 0;
        if (!chanceBase || multiplierFs === undefined) return ({error: "Invalid Tier."});
        let chance = 0;
        if(softcap === 0){
            chance = ((failstack  * multiplierFs) + chanceBase);
            if(chance >= 100){
                chance = 100;
            }
        }else if(failstack > softcap){
            chance = ((failstack - softcap) * (multiplierFs/5))+ (softcap * multiplierFs) + chanceBase;
            if(chance >= 90){
                chance = 90;
            }
        }else{
            chance = ((failstack  * multiplierFs) + chanceBase);
            if(chance >= 90){
                chance = 90;
            }
        }
        return {
            itemGrade: itemGrade,
            itemCategory: itemCategory,
            profileKey: profileKey,
            chanceBase: chanceBase,
            fsMultiplier: multiplierFs,
            crons: finalCronCost,
            softcap: softcap,
            durabilityLoss: durabilityLoss,
            chance: chance,
            blackstoneIcon: blackstone
        };        
    }
}

/*function main(){
    const test = new EnhancementCalculator(736026);
    const result = test.getSuccessRateAndData(0, 0);
    console.log(result);
}

main()
export default EnhancementCalculator;*/