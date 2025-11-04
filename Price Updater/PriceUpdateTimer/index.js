const axios = require('axios');
const { createClient } = require('redis')

const db = require('knex')({
    client: 'mysql2',
    connection: {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME,
        ssl: { rejectUnauthorized: true }
    }
});


const api = axios.create({
    baseURL: 'https://api.arsha.io/v2'
}
);

class DbItems{
    constructor(redisClient){
        this.redisClient = redisClient;
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
    async updateAllItems(context){
        try{
            for (const itemRegion in this.region){
                const region = this.region[itemRegion];                
                for(const itemName in this.idData){
                    const itemId = this.idData[itemName];
                    context.log(`--- INICIANDO Item: ${itemName}, Região: ${region} ---`);
                    let currentItem = null;
                    try{
                        currentItem = await db('item_prices').where({
                                item_id: itemId,
                                region: region
                            }).first();
                    }catch(error){
                        currentItem = null;
                        context.log.error(`Erro ao buscar ${itemId} em ${region}`, error.message);
                    }
                    try{
                        const price = await this.GetItemPrice(itemId, region)
                        await db('item_prices').where({
                            item_id: itemId,
                            region: region
                        }).update({
                            price: price.lastSoldPrice,
                            last_updated: db.fn.now()
                        });
                        
                        context.log(`Preço do item: ${itemId} da região: ${region} atualizado para ${price.lastSoldPrice} na DB`)

                        const cacheKey = `item:${region}:${itemId}`;
                        const cacheValue = JSON.stringify({
                            itemId: itemId,
                            itemName: itemName,
                            region: region,
                            price: price.lastSoldPrice,
                            lastUpdated: new Date().toISOString()
                        });
                        context.log("Cache Key: " + cacheKey);
                        await this.redisClient.set(cacheKey, cacheValue, { EX: 3600 });

                        context.log(`Preço do item: ${itemId} da região: ${region} atualizado para ${price.lastSoldPrice} na DB e no cache`)
                        context.log(`[${itemName}] Cache Redis atualizado. Aguardando 1s...`);
                        await this.sleep(500);
                    }catch(error){
                        context.log.error(`Erro ao atualizar item ${itemId} (${itemName}) na região ${region}:`, error);
                    }
                }
            }
        }catch(error){
            console.error("Erro ao usar o updateAllItems", error);
            throw error;
        }
        }
    }

module.exports = async function (context, myTimer) {  
    context.log('--- Início da Execução da Função ---');  

    context.log('Verificando variáveis de ambiente do Redis...');  
    const redisHost = process.env.REDIS_HOST;  
    const redisPort = process.env.REDIS_PORT;  
    const redisPassword = process.env.REDIS_PASSWORD;  

    context.log(`Host: ${redisHost}`);  
    context.log(`Port: ${redisPort}`);  
    context.log(`Password (primeiros 3 chars): ${redisPassword ? redisPassword.substring(0, 3) + '...' : 'NÃO DEFINIDA'}`);  
  
    if (!redisHost || !redisPort || !redisPassword) {  
        context.log.error("ERRO CRÍTICO: As variáveis de ambiente REDIS_HOST, REDIS_PORT ou REDIS_PASSWORD não foram encontradas. Verifique as 'Configurações -> Configuração' da sua Function App no portal do Azure.");  
        return;
    }  
    context.log('Variáveis de ambiente encontradas.');  

  
    let client;  
    try {  
        client = createClient({    
            password: redisPassword,  
            socket: {  
                host: redisHost,  
                port: redisPort,  
                tls: true,  
                connectTimeout: 15000
            }  
        });  
        client.on('error', (err) => context.log.error('Redis Client Error:', err));  

        context.log('Tentando executar "await client.connect()"...');  
        await client.connect();  
        context.log('SUCESSO: "client.connect()" executado sem erros.');  
          
        const start = new DbItems(client);  
        await start.updateAllItems(context);   
        context.log('Atualização de preços concluída com sucesso.');  
  
    } catch (error) {  
        context.log.error('ERRO CAPTURADO: A execução da função falhou.');  
        context.log.error('Mensagem do Erro:', error.message);  
        context.log.error('Stack do Erro:', error.stack);  
        throw error;  
    } finally {  
        if (client && client.isOpen) {  
            await client.quit();  
            context.log('Conexão com o Redis fechada.');  
        }  
        await db.destroy();  
        context.log('Pool de conexões do banco de dados destruído.');  
    }  
};