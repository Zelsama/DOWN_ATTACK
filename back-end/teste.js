import axios from 'axios';
import { gotScraping } from 'got-scraping';
import S3Service from './services/S3Service.js';
import dotenv from "dotenv";
dotenv.config();

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

        const web_path = await new S3Service().uploadFile(`skills/${className}/icon_${id}.webp`, body, 'image/webp');
        
        return web_path

    } catch(error) {
        console.error(error);
    }
}

await download_icon('Hashashin', 5679).then((path) => {
    console.log('Icon uploaded to:', path);
}).catch((error) => {
    console.error('Error uploading icon:', error);
});