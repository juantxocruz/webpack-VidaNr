

function calcTobaccoLife(units) {

    let result = 0;
    if (units <= 19) {
        result += 0;
    }
    if (units > 19 && units <= 39) {
        result += 25;
    }
    if (units > 39) {
        result += 50;
    }
    return result;

}

function calcTobaccoILT(units) {

    let result = 0;
    if (units <= 15) {
        result += 0;
    }
    if (units > 15 && units <= 25) {
        result += 25;
    }
    if (units > 25 && units <= 40) {
        result += 50;
    }
    if (units > 40) {
        result += 100;
    }
    return result;
}

export function calcTobacco(cigarretes, cigars, pipes) {
    let units = +cigarretes + (+cigars * 3) + (+pipes * 2);
    let tobaccoLife = calcTobaccoLife(units);
    let tobaccoILT = calcTobaccoILT(units);

    return {
        life: tobaccoLife,
        disability: tobaccoLife,
        accident: tobaccoLife,
        serious_illness: tobaccoLife,
        ilt: tobaccoILT
    }
}




