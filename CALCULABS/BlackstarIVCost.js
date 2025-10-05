const blackstone = 100000;
const memory = 0;
const sharp_blackstone = 5900000;
const flawless_blackstone = 2* sharp_blackstone;
const valksCry = 6555891;
const costStack97 = 0//729000000 + (13 * valksCry);
const costStack45 = 0//406 * blackstone;
const costStack40 = 0//230 * blackstone;
const costStack35 = 136 * blackstone;
const costStack30 = 84 * blackstone;
const costStack25 = 53 * blackstone;
const costStack20 = 33 * blackstone;
const costStack10 = 21 * blackstone;
const costStack5 = 5 * blackstone;
const costBlackstarI = 1990000000;
const stackDuo = 42;
const stackTri = 60;
const stackTet = 110;
const limitStackDuo = 51;
const limitStackTri = 110;
const limitStackTet = 190;
var loops = 100000;


function drawNum(min, max){
    return Math.floor(Math.random()*(max - min + 1)+min)
}
function drawDuo(stack){
    var sortednum = drawNum(1, 10000)
    const basechance = 10.625
    var chance = 0
    if (stack < 56){
        var chance = (basechance + (stack*1.062)) * 100
    }else if (stack < 150){
        var chance = (70.125 + (stack  * 0.212)) * 100
    }else{
        var chance = 90 * 100
    }
    if (sortednum > chance){
        console.log(false)
        return false;
    }else{
        console.log(true)
        return true;
    }
}
function drawTri(stack){
    var sortednum = drawNum(1, 10000)
    const basechance = 3.4
    var chance = 0
    if (stack < 196){
        var chance = (basechance + (stack*0.34)) * 100
    }else if (stack < 490){
        var chance = (70.04 + (stack  * 0.068)) * 100
    }else{
        var chance = 90 * 100
    }
    if (sortednum > chance){
        console.log(false)
        return false;
    }else{
        console.log(true)
        return true;
    }
}
function drawTet(stack){
    var sortednum = drawNum(1, 10000)
    const basechance = 0.51
    var chance = 0
    if (stack < 1363){
        var chance = (basechance + (stack*0.051)) * 100
    }else if (stack < 3322){
        var chance = (70.02 + (stack  * 0.01)) * 100
    }else{
        var chance = 90 * 100
    }
    if (sortednum > chance){
        console.log(false)
        return false;
    }else{
        console.log(true)
        return true;
    }
}

function makeDuo() {
    let duoStack = stackDuo; // Começa com o stack inicial global
    let attempts = 0, totalCost = 0, success = false, failstacks = [];
    
    while (attempts < 5 && !success) {
        // Verifica se atingiu o limite
        if (duoStack >= limitStackDuo) {
            failstacks.push(duoStack); // Guarda o stack excedente
            duoStack = stackDuo; // Volta ao stack inicial
            totalCost += costStack40; // Custo para recomeçar
        }
        
        // Tentativa de DUO
        if (drawDuo(duoStack)) {
            totalCost += costStack40 + flawless_blackstone;
            success = true;
        } else {
            duoStack += 3; // Incrementa o stack
            totalCost += flawless_blackstone + (memory * 20);
            attempts++;
            
            // Pity na 5ª falha
            if (attempts === 5) {
                totalCost += flawless_blackstone;
                failstacks.push(duoStack); // Guarda o stack do Pity
            }
        }
    }
    
    return {totalCost, failstacks, finalStack: duoStack };
}

function makeTri(){
    let attempts = 0, totalCost = 0, success = false,failstacks = [];
    let triStack = stackTri;
    let duoAttempts = [];

    while(attempts < 6 && !success){
        if (stackDuo >= limitStackTri){ 
            failstacks.push(triStack);
            triStack = stackTri;
            totalCost += costStack45 + (13 * valksCry);
        }        
        if (drawTri(stackTri)){
            totalCost += costStack45 + flawless_blackstone + (13 * valksCry);
            success = true;
        }else{
            triStack += 4; //Incrementa 4 no failstack
            let duoResult = makeDuo();
            duoAttempts.push(duoResult)
            totalCost += flawless_blackstone + (memory * 20) + duoResult.totalCost;
            attempts++;

            if (attempts == 6){
                let pitDuo = makeDuo();
                duoAttempts.push(pitDuo);
                totalCost += flawless_blackstone + pitDuo.totalCost;
                failstacks.push(triStack);
            }
        }
        }
    return {
        totalCost,
        failstacks: [...failstacks, ...duoAttempts.flatMap(a => a.failstacks)],
        finalStack: triStack,
        duoAttempts
    };
}

function makeTet(){
    let attempts = 0, totalCost = 0, success = false,failstacks = [];
    let tetStack = stackTet;
    let triAttempts = [];

    while(attempts < 9 && !success){
        if (tetStack >= limitStackTri){ 
            failstacks.push(tetStack);
            tetStack = stackTet;
            totalCost += costStack97 + (13 * valksCry);
        }        
        if (drawTri(stackTri)){
            totalCost += costStack97 + flawless_blackstone + (13 * valksCry);
            success = true;
        }else{
            tetStack += 5; //Incrementa 4 no failstack
            let triResult = makeTri();
            triAttempts.push(triResult)
            totalCost += flawless_blackstone + (memory * 20) + triResult.totalCost;
            attempts++;

            if (attempts == 9){
                let pitTri = makeTri();
                triAttempts.push(pitTri);
                totalCost += flawless_blackstone + pitTri.totalCost;
                failstacks.push(tetStack);
            }
        }
        }
    totalCost += costBlackstarI;
    return {
        totalCost,
        failstacks: [...failstacks, ...triAttempts.flatMap(a => a.failstacks)],
        finalStack: tetStack,
        triAttempts
    };   
}
/*
let contadorf = 0;
let contadort = 0;

while(loops > 0){
    let j = (drawTet(110))
    if (j){
        contadort++;
    }else{
        contadorf++;
    }
    loops --;
}
console.log("falsos: " + contadorf, "verdadeiros: "+ contadort)
*/

/*

let total = 0;
while (loops--) {
    total += makeTet().totalCost;
}
console.log(`Custo médio: ${(total/10000/1000000).toFixed(2)} milhões`);
*/
var x = 100000
var total = 0;
while (x > 0){
    total += makeTet().totalCost
    x --;
}
console.log(total/100000)