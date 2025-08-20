import CalculaStackSoberana from "./CalculaStackSoberana.js";

const teste = new CalculaStackSoberana();
const result = await teste.findItemInDb(65319);
console.log(result);