import express from 'express';
import db from '../database/connection.js';
import axios from 'axios';
import fs from 'fs';
import { gotScraping } from 'got-scraping';
import { ensureAdmin } from '../middleware/auth.js';
import { s3Service } from '../index.js';

const SkillsRoutes = express.Router();

SkillsRoutes.get('/:className', async (req, res)=>{
    const className = req.params.className;
    await db.transaction(async trx => {
        const skillsQuery = await trx('skills').where({ class: className }).orderBy('skill_id', 'asc');
        const skillsHitsQuery = await trx('skills_hits').whereIn('skill_id', skillsQuery.map(skill => skill.skill_id)).orderBy(['skill_id', 'hit_number']);
        res.status(200).json({
            success: true,
            skills: skillsQuery,
            skills_hits: skillsHitsQuery
        })
    }).catch(error => {
        res.status(500).json({
            success: false,
            error: error
        })  
    });
});   


SkillsRoutes.delete('/:skill_id', ensureAdmin, async (req, res)=>{
    await db.transaction(async trx => {
        return await deleteSkillData(trx, req.params.skill_id);
    }).then(() =>{
        res.status(200).json({
            success: true,
            message: `Skill with ID ${req.params.skill_id} deleted successfully.`
        })
    }).catch(error => {
        res.status(500).json({
            success: false,
            error: error
        })  
    });
});
SkillsRoutes.put('/', ensureAdmin, async (req, res)=>{
    const icon_path = await download_icon(req.body.class, req.body.skill_id);
    
    await db.transaction(async trx => {
        return await saveSkillDaata(trx, req.body, icon_path);
    }).then(([skillsHitsQuery, skillsQuery]) =>{
        res.status(200).json({
            success: true,
            skillsHitsQuery,
            skillsQuery,
            icon_path
        })
    }).catch(error => {
        res.status(500).json({
            success: false,
            error: error
        })
    });
});

SkillsRoutes.post('/', ensureAdmin, async (req, res)=>{
    const icon_path = await download_icon(req.body.class, req.body.skill_id);

    await db.transaction(async trx => {
        const skill_already_exists = await trx('skills').where({ skill_id: req.body.skill_id }).first();
        if(skill_already_exists){
            throw new Error('Skill with this ID already exists.');
        }
        return await saveSkillDaata(trx, req.body, icon_path);
    }).then(([skillsHitsQuery, skillsQuery]) =>{
        res.status(200).json({
            success: true,
            skillsHitsQuery,
            skillsQuery,
            icon_path
        })
    }).catch(error => {
        res.status(500).json({
            success: false,
            error: error.message
        })
    });
});

const saveSkillDaata = async (trx, skillData, icon_path) => {
    const {hits, skill_id, name, class: className, skill_spec, cooldown} = skillData;

    await deleteSkillData(trx, skill_id);

    const skillsQuery = await trx('skills').insert({
        skill_id,
        name,
        class: className,
        skill_spec,
        cooldown,
        icon_path
    });
    const hits_with_skill_id = hits.map(item => ({
        ...item,
        skill_id
    }))
    const skillsHitsQuery = await trx('skills_hits').insert(hits_with_skill_id);
    return [skillsHitsQuery, skillsQuery, icon_path];
}

const deleteSkillData = async (trx, skill_id) => {
    await trx('skills_hits').where({ skill_id }).del();
    await trx('skills').where({ skill_id }).del();
}


const download_icon = async (className, id) => {
    const api_url = `https://apiv2.bdolytics.com/en/NA/db/skill/${id}`
    const icon_base_url = 'https://cdn.bdolytics.com/img/'

    try {
        const final_url = await axios(api_url);

        const img_url = icon_base_url + (final_url.data.data.icon_image).toLowerCase() + ".webp";
        
        const { body } = await gotScraping({
            url: img_url,
            method: 'GET',
            responseType: 'buffer'
        });

        const web_path = await new s3Service().uploadFile(`skills/${className}/icon_${id}.webp`, body, 'image/webp');
        
        return web_path

    } catch(error) {
        console.error(error);
    }
}


export default SkillsRoutes;
