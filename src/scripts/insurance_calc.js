

//lnTVida = ROUND((lnIMC + lnTension + lnFuma + lnBebe + lnColes) * (1.1 ^ (nagra - 1)) / 25, 0) * 25
//lnTInva = ROUND((lnIMC + lnTension + lnFuma + IIF(lnBebe <= 75, lnBebe, 999) + lnColes) * (1.1 ^ (nagra - 1)) / 25, 0) * 25
//lnTAcci = ROUND(((lnIMC / 2) + lnTension + lnFuma + IIF(lnBebe <= 75, lnBebe, 999) + lnColes) * (1.1 ^ (nagra - 1)) / 25, 0) * 25
//lnTEnf = ROUND((lnIMC + lnTension + (lnFuma * 1.5) + lnBebe + lnColes) * (1.2 ^ (nagra - 1)) / 25, 0) * 25
//lnTILT = ROUND((lnIMC_ILT + lnTension + lnFuma_ILT + lnBebe_ILT + lnColes) * (1.1 ^ (nagrsa - 1)) / 25, 0) * 25


// =ROUND(((B11+B17+B13+B15+B18)*(POWER(1.1, (B27-1)))/25),0)*25
function calcLife(result, factor) {
    return Math.round((result.imc.life + result.tension + result.tobacco.life + result.alcohol.life + result.cholesterol) * ((Math.pow(1.1, (factor.life - 1))) / 25)) * 25;

}
function calcDisability(result, factor) {
    return Math.round((result.imc.life + result.tension + result.tobacco.life + (result.alcohol.life <= 75 ? result.alcohol.life : 999) + result.cholesterol) * ((Math.pow(1.1, (factor.life - 1))) / 25)) * 25;

}

function calcAccident(result, factor) {
    return Math.round(((result.imc.life / 2) + result.tension + result.tobacco.life + (result.alcohol.life <= 75 ? result.alcohol.life : 999) + result.cholesterol) * ((Math.pow(1.1, (factor.life - 1))) / 25)) * 25;

}


function calcSeriousIllness(result, factor) {
    return Math.round((result.imc.life + result.tension + (result.tobacco.life * 1.5) + result.alcohol.life + result.cholesterol) * ((Math.pow(1.2, (factor.life - 1))) / 25)) * 25;

}
function calcIlt(result, factor) {
    return Math.round((result.imc.ilt + result.tension + result.tobacco.ilt + result.alcohol.ilt + result.cholesterol) * ((Math.pow(1.1, (factor.life - 1))) / 25)) * 25;

}


export function calcInsurance(result, factor) {
    let insurance = {
        life: calcLife(result, factor),
        disability: calcDisability(result, factor),
        accident: calcAccident(result, factor),
        serious_illness: calcSeriousIllness(result, factor),
        ilt: calcIlt(result, factor)
    }
    return insurance;


}

// =IF(factor<2, 200, 300)
export function calcInMax(factor) {
    return factor.life < 2 ? 200 : 300;
}

