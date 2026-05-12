

// recargo > 0 -> +1
// recargo === 0 -> +0
function sumFactorByRisk(risk) {
    let result = 0;
    if (risk > 0) {
        result += 1;
    }
    return result;
}

function sumFactor(result, type) {
    let sum = 0;
    let fAlcohol = sumFactorByRisk(result.alcohol[type]);
    let fCholesterol = sumFactorByRisk(result.cholesterol);
    let fImc = sumFactorByRisk(result.imc[type]);
    let fTension = sumFactorByRisk(result.tension);
    let fTobacco = sumFactorByRisk(result.tobacco[type]);
    sum = fAlcohol + fCholesterol + fImc + fTension + fTobacco;

    return sum;
}

// en los cálculos se utiliza el factor.life para todos los casos
// Note: factor.ilt is calculated for documentation but all insurances (including ILT) use factor.life
// This matches the original FoxPro logic where nagra (calculated from life surcharges) is used for all insurance types
export function calcFactor(result) {
    let factor = {
        life: sumFactor(result, 'life'),
        ilt: sumFactor(result, 'ilt'),  // Calculated for documentation, not used in formulas
    }
    return factor;


}


