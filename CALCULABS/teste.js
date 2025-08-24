import client from './connection/redis-client.js';
import CalculaStackSoberana from './CalculaStackSoberana.js';

/*const cacheKey = `item:sa:65319`;

const cacheValue = JSON.stringify({
    itemId: 65319,
    itemName: 'Dark Hunger',
    region: 'sa',
    price: 1000,
    lastUpdated: new Date().toISOString()
});

await client.connect();

await client.set(cacheKey, cacheValue, { EX: 20 }); 
console.log(`Cache set for ${cacheKey} with value: ${cacheValue}`);*/


client.connect();
const calculators = new CalculaStackSoberana();
const result = await calculators.findItemInDb(65319);

client.quit();
console.log(result?.price);