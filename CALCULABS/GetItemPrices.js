import axios from 'axios';
import db from './database/connection.js';

const api = axios.create({
    baseURL: 'https://api.arsha.io/v2'
}
);

class DbItems{
    constructor(){
        this.region = ['na', 'eu', 'sea', 'mena', 'kr', 'ru', 'jp', 'th', 'tw', 'sa'];
        this.idData = {
            'DarkHunger': 65319,
            'FaintDarkHunger': 767102,
            'EssenceOfDawn': 820979
        }        
        this.logEnabled = true;
    }
    sleep(miliseconds){
        return new Promise(resolve => setTimeout(resolve, miliseconds))
    }
    async initialize(){
        await this.updateAllItems();

        this.updateInterval = setInterval(async ()=>{
            try{
                console.log('-=-=-=-=-=-=-=-=-=-=-=-=-')
                console.log("Atualizando os preços...")
                console.log('-=-=-=-=-=-=-=-=-=-=-=-=-')
                await this.updateAllItems();
            }catch(error){
                console.error("Erro durante a atualização automática.", error);
                setTimeout(()=>this.updateAllItems(), 6000)
            }
        }, 3600000);
    }
   async GetItemPrice(itemID, region){
    try{
        const response = await api.get(`/${region}/item?id=${itemID}`)
        return response.data;
    }catch(error){
        throw error;
    }
}
    async fetchAllPrices(){
        try{
            for(const itemRegion in this.region){
                const region = this.region[itemRegion];
                console.log("REGIÃO: " + this.region[itemRegion])
                for(const itemName in this.idData){
                    const result = await this.GetItemPrice(this.idData[itemName], region)
                    await db('item_prices').insert({
                        item_id: this.idData[itemName],
                        item_name: itemName,
                        price: result.lastSoldPrice,
                        region: region,
                        last_updated: db.fn.now()
                    }
                    )
                }
                await this.sleep(5000);
            }
        }catch(error){
            console.error('Erro ao consultar: ', error);
        }

    }
    async updateAllItems(){
        try{
            for (const itemRegion in this.region){
                const region = this.region[itemRegion];                
                for(const itemName in this.idData){
                    const itemId = this.idData[itemName];
                    let currentItem = null;
                    try{
                        currentItem = await db('item_prices').where({
                                item_id: itemId,
                                region: region
                            }).first();
                    }catch(error){
                        currentItem = null;
                        console.error(`Erro ao buscar ${itemId} em ${region}`, error.message);
                    }
                    try{
                        const price = await this.GetItemPrice(itemId, region)
                        const updateRows = await db('item_prices').where({
                            item_id: itemId,
                            region: region
                        }).update({
                            price: price.lastSoldPrice,
                            last_updated: db.fn.now()
                        });
                        if(updateRows === 0){
                            await db('item_prices_log').insert({
                                itemId: itemId,
                                itemName: itemName,
                                region: region,
                                old_price: 0,
                                new_price: null,
                                error_message: "Registro não encontrado no banco"
                            })
                            continue;
                        }

                        console.log(`Preço do item: ${itemId} da região: ${region} atualizado para ${price.lastSoldPrice} `)
                        await this.sleep(1000);
                    }catch(error){
                        console.error(`Erro ao atualizar item ${itemId} (${itemName}) na região ${region}:`, error);
                        if(this.logEnabled){
                            await db('item_prices_log').insert({
                                item_id: itemId,
                                item_name: itemName,
                                region: region,
                                old_price: currentItem?.price || 0,
                                new_price: null,
                                error_message: error.message.substring(0, 255)
                            });
                        }
                    }
                }
            }
        }catch(error){
            console.error("Erro ao usar o updateAllItems", error);
            throw error;
        }
        }
    }


const start = new DbItems();

await start.initialize();