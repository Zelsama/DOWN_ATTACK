import CalculaStackSoberana from "./CalculaStackSoberana.js";

const teste = await CalculaStackSoberana.create('SA', 'Sovereign')
const result = teste.findOptimalStack(3, 100, 13, 4);
console.log(result);