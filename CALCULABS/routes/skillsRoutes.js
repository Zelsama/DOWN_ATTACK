import express from 'express';
import db from '../database/connection.js';
import axios from 'axios';
import path from 'path';
import { gotScraping } from 'got-scraping';

const SkillsRoutes = express.Router();

SkillsRoutes.post('/', (req, res)=>{
    const {hits, skill_id, name, class: className, skill_spec, cooldown} = req.body
    try {
        
        const skillQuery = db('skills').insert({
            skill_id,
            name,
            className,
            skill_spec,
            cooldown
        })

        for (const element of hits) {
            
        }
    }catch (error){
    
    }
});


const download_icon = async (className, id) => {
    const api_url = `https://apiv2.bdolytics.com/en/NA/db/skill/${id}`
    const icon_base_url = 'https://cdn.bdolytics.com/img/'

    try {
        const final_url = await axios(api_url);

        const img_url = icon_base_url + (final_url.data.data.icon_image).toLowerCase() + ".webp";
        
        const readStream = gotScraping.stream(img_url);

        const pastaDestino = path.join('..', 'BDOOPT_VUE', 'bdo-optimizer-temp', 'public', 'skills', className);

        await fs.promises.mkdir(pastaDestino, { recursive: true });

        const writer = fs.createWriteStream(path.join(pastaDestino, `icon_${id}.webp`));
        
        readStream.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(img_url));
            writer.on('error', reject);
            img_url
        });

    } catch(error) {
        console.error(error);
    }
}

export default SkillsRoutes;