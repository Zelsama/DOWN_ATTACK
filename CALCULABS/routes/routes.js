import express from 'express';
import CalculaStackSoberana from '../CalculaStackSoberana.js';
import EnhancementCalculator from '../EnhancementCalculator.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: "API funcionando!" });
});

router.get('/fs-optimizer', async (req, res)=>{
    try {
        const {tier, baseChance, valks, stacks, item, region} = req.query;
        const calculators = await CalculaStackSoberana.create(region, item);
        const result = calculators.findOptimalStack(
            parseInt(tier),
            parseInt(baseChance),
            parseInt(valks),
            parseInt(stacks)
        );
        res.json({ success:true, result})
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})
router.get('/get-success-rate', async (req, res)=>{
    try {
        const {tier, stack, item} = req.query;
        
        const calculators = new CalculaStackSoberana('sa', item);
        const result = calculators.getSuccessRate(
            parseInt(tier),
            parseInt(stack),
        );
        res.json({ success:true, result})
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})

router.get('/find-item-crons', async(req, res)=>{
    try{
        const {tier, item} = req.query;
        const calculators = new CalculaStackSoberana('sa', item);
        const result = await calculators.findItemCrons(tier);
        res.json({ success:true, result})
    }catch(error){
        res.status(500).json({success:false, error:error})
    }
})

router.get('/get-success-rate-and-data', async (req, res)=>{
    try {
        const {tier, stack, itemId} = req.query;
        
        const calculators = new EnhancementCalculator(parseInt(itemId));
        const result = calculators.getSuccessRateAndData(
            tier,
            parseInt(stack),
        );
        res.json({ success:true, result})
    } catch (error){
        res.status(500).json({success: false, error: error});
    }
})

export default router; // Exportação padrão