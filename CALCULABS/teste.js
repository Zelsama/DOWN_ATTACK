import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.arsha.io/v2'
}
)
async function GetItemPrice(itemID, region){
    try{
        const response = await api.get(`/${region}/item?id=${itemID}`)
        return response.data;
    }catch(error){
        throw error;
    }
}

const maria = await GetItemPrice(65319, 'sa');
console.log(maria.lastSoldPrice);