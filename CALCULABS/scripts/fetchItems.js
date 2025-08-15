import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // <--- 2. PEGUE O CAMINHO DO ARQUIVO  
const __dirname = path.dirname(__filename);      // <--- 3. PEGUE O DIRETÓRIO A PARTIR DO CAMINHO

const API_URL = 'https://apiv2.bdolytics.com/en/NA/market/central-market-data';
const ICON_BASE_URL = 'https://cdn.bdolytics.com/img/';

const MAIN_CATEGORY_MAP = {
    //1: 'Main Weapons',
    //10: 'Awakening Weapons',
    //5: 'Offhand Weapons',
    //15: 'Armors',
    20: 'Accessories'
};

const SUB_CATEGORY_MAP_ARMORS = {
    1: 'Helmet',
    2: 'Armor',
    3: 'Gloves',
    4: 'Shoes'
};

const SUB_CATEGORY_MAP_ACCESSORIES = {
    1: 'Ring',
    2: 'Necklace',
    3: 'Earring',
    4: 'Belt'
};

const GRADE_TYPE_MAP = {
    1: '#48BB78', // Verde
    2: '#04b3f1', // Azul
    3: '#ECC94B', // Amarelo
    4: '#e53e3e', // Vermelho
    5: '#8a63d2'  // Roxo 
};

const GRADE_BLACKSTONE = {
    1: '/icons/Concentrada.png',
    2: '/icons/Concentrada.png',
    3: '/icons/Concentrada.png',
    4: '/icons/flawless_blackstone.png',
    5: '/icons/primordial_blackstone.png',
}

async function fetchData() {
    console.log('[DEBUG] INICIANDO BUSCA NA API');
    try {
        const response = await fetch(API_URL);
        if(!response.ok){
            throw new Error(`Error na API : ${response.statusText}`);
        }
        const responseData = await response.json();
        const allItems = responseData.data;
        console.log(`Foram recebidos ${allItems.length} itens no total`);

        const processedData = [];
        for(const item of allItems){
            if(MAIN_CATEGORY_MAP[item.market_main_category] && SUB_CATEGORY_MAP_ACCESSORIES[item.market_sub_category] &&GRADE_TYPE_MAP[item.grade_type]){
                const formattedItems = {
                    id: item.id,
                    name: item.name,
                    grade_type: item.grade_type,
                    main_category: item.market_main_category,
                    sub_category: item.market_sub_category
                };
                processedData.push(formattedItems);
            }
        }
        console.log(`Processamento concluído. ${processedData.length} itens foram filtrados e formatados.`);
        console.log("Amostra dos dados processados: ", processedData.slice(0,5));

        const outputPath = path.join(__dirname, 'dados_formatados.json');

        await fs.writeFile(outputPath, JSON.stringify(processedData, null, 2))
        console.log('Dados salvos em: '+ outputPath);
    }catch(error){
        console.error("Ocorreu um erro: ", error);
    }
}

async function downloadImage(url, destPath){
    try{
        console.log(`Baixando: ${url}`);
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`Falha ao baixar a imagem: ${response.statusText}`);
        }

        const imageBuffer = Buffer.from(await response.arrayBuffer());

        await fs.writeFile(destPath, imageBuffer);
        console.log('Salvo em: ' + destPath);

    }catch(error){
        console.error(`Error ao baixar ${url}`, error.message);
    }
}

async function main() {  
  try {  
    const imageUrl = 'https://cdn.bdolytics.com/img/new_icon/06_pc_equipitem/00_common/01_weapon/00010003.webp';   
    const destinationFolder = path.join(__dirname, '..', '..', 'public', 'items');  
    const filename = path.basename(imageUrl);  
    console.log("FILENAME: "+ filename);
    const destinationPath = path.join(destinationFolder, filename);  
    console.log("DESTINATION PATH: " + destinationPath);
    await fs.mkdir(destinationFolder, { recursive: true });  
    console.log(`[SETUP] Pasta de destino garantida: ${destinationFolder}`);   
    await downloadImage(imageUrl, destinationPath);  
  } catch (error) {  
    console.error("\n[ERRO GERAL] O script não pôde ser concluído:", error.message);  
  }  
}  

fetchData();