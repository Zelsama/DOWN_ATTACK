import express from 'express';
import PvpCalculator from '../PvpCalculator.js';

const PvpCalculatorRoutes = express.Router();

PvpCalculatorRoutes.post('/calculate', (req, res) => {
    try {
        const { 
            attacker_class,
            defender_class,
            defender_class_spec,
            attacker_class_spec,
            skill_spec,
            total_ap_pvp,
            total_aap_pvp,
            sheet_ap,
            sheet_aap,
            melee_dr,
            ranged_dr,
            magic_dr,
            accuracy,
            melee_evasion,
            ranged_evasion,
            magic_evasion,
            dr_percent,
            critical,
            back_attack,
            down_attack,
            air_attack,
            skill_damage_percent,
            skill_pvp_reduction_percent,
            critical_hit_rate,
            state
        } = req.body;
        if (skill_damage_percent <= 0){
            return res.status(400).json({
                error: "skill damage must be greater than 0"
            })
        }
        if (!attacker_class || !defender_class) {
            return res.status(400).json({ 
                error: 'attacker_class and defender_class are required' 
            });
        }

        if (!attacker_class_spec || !defender_class_spec || !skill_spec) {
            return res.status(400).json({ 
                error: 'attacker_class_spec, defender_class_spec and skill_spec are required' 
            });
        }

        // Cria o calculador (sem class_pvp_modifier - ele é calculado internamente)
        const calculator = new PvpCalculator(
            attacker_class,
            defender_class,
            defender_class_spec,
            attacker_class_spec,
            skill_spec,
            parseFloat(total_ap_pvp) || 0,
            parseFloat(total_aap_pvp) || 0,
            parseFloat(sheet_ap) || 0,
            parseFloat(sheet_aap) || 0,
            parseFloat(melee_dr) || 0,
            parseFloat(ranged_dr) || 0,
            parseFloat(magic_dr) || 0,
            parseFloat(accuracy) || 0,
            parseFloat(melee_evasion) || 0,
            parseFloat(ranged_evasion) || 0,
            parseFloat(magic_evasion) || 0,
            parseFloat(dr_percent) || 0,
            parseFloat(critical) || 0,
            parseFloat(back_attack) || 0,
            parseFloat(down_attack) || 0,
            parseFloat(air_attack) || 0,
            parseFloat(skill_damage_percent) || 100,
            parseFloat(skill_pvp_reduction_percent) || 100,
            parseFloat(critical_hit_rate) || 0
        );

        // Calcula o resultado
        const result = calculator.hpLossCalculator(state || 'normal');
        
        // Retorna resultado com informações adicionais
        res.json({ 
            success: true,
            data: {
                hp_loss: result.hp_loss,
                hitrate: result.hitrate,
                class_pvp_modifier: calculator.class_pvp_modifier,
                dr_used: calculator.dr,
                evasion_used: calculator.evasion
            }
        });
        
    } catch (error) {
        console.error('Error calculating PvP:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

export default PvpCalculatorRoutes;