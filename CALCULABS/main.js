import CalculaStackSoberana from './CalculaStackSoberana.js';

try {
    const calculator = await CalculaStackSoberana.create('sa','Sovereign');
    const result = calculator.findOptimalStack(3, 200, 0, 0);
    //const calculator = new CalculaStackSoberana('sa', 'Armors');
    //const result = calculator.getSuccessRate(2, 100);
    console.log(result);
} catch (error) {
    console.error("Erro:", error);
}