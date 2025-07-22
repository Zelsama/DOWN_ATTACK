import CalculaStackSoberana from './CalculaStackSoberana.js';

try {
    const calculator = await CalculaStackSoberana.create('sa');
    const result = calculator.findOptimalStack(6, 100, 13, 2);
    console.log(result);
} catch (error) {
    console.error("Erro:", error);
}