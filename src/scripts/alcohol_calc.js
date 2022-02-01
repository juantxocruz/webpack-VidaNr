
function calcAlcoholLife(units, gender, age) {

    let result = 0;
    if (gender === 'female') {
        if (units <= 2) {
            result += 0;
        }
        if (units === 3) {
            result += 50;
        }
        if (units === 4) {
            result += 100;
        }
        if (units > 4) {
            result += 999;
        }
    }

    if (gender === 'male') {
        if (units <= 4) {
            result += 0;
        }
        if (units === 5) {
            result += 50;
        }
        if (units === 6) {
            result += 100;
        }
        if (units > 6) {
            result += 999;
        }
    }
    if (result > 0 && result < 999 && age > 45) {
        result -= 25;
    }
    return result;
}

function calcAlcoholILT(units, gender) {

    let result = 0;
    if (gender === 'female') {
        if (units <= 1) {
            result += 0;
        }
        if (units === 2) {
            result += 25;
        }
        if (units === 3) {
            result += 50;
        }
        if (units > 3) {
            result += 999;
        }
    }

    if (gender === 'male') {
        if (units <= 2) {
            result += 0;
        }
        if (units === 3) {
            result += 25;
        }
        if (units === 4) {
            result += 50;
        }
        if (units > 4) {
            result += 999;
        }
    }
    return result;
}

export function calcAlcohol(wines, beers, spirits, gender, age) {
    let units = +wines + (+beers) + (+spirits * 2);
    let alcoholLife = calcAlcoholLife(units, gender, age);
    let alcoholILT = calcAlcoholILT(units, gender);

    return {
        life: alcoholLife,
        disability: alcoholLife,
        accident: alcoholLife,
        serious_illness: alcoholLife,
        ilt: alcoholILT
    }
}



