

function calcImcLife(imc, age) {

    let result = 0;
    if (age <= 34) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 50;
        }
        if (imc > 18 && imc <= 21) {
            result += 25;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 75;
        }
        if (imc > 37 && imc <= 40) {
            result += 100;
        }
        if (imc > 40 && imc <= 43) {
            result += 125;
        }
        if (imc > 43 && imc <= 45) {
            result += 175;
        }
        if (imc > 45 && imc <= 46) {
            result += 225;
        }
        if (imc > 46) {
            result += -1;
        }
    }
    if (age > 34 && age <= 55) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 25;
        }
        if (imc > 34 && imc <= 37) {
            result += 50;
        }
        if (imc > 37 && imc <= 40) {
            result += 75;
        }
        if (imc > 40 && imc <= 43) {
            result += 100;
        }
        if (imc > 43 && imc <= 45) {
            result += 150;
        }
        if (imc > 45 && imc <= 46) {
            result += 200;
        }
        if (imc > 46) {
            result += -1;
        }
    }
    if (age > 55) {
        if (imc <= 16) {
            result += -2; // aplazar
        }
        if (imc > 16 && imc <= 18) {
            result += 0;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 0;
        }
        if (imc > 32 && imc <= 34) {
            result += 25;
        }
        if (imc > 34 && imc <= 37) {
            result += 25;
        }
        if (imc > 37 && imc <= 40) {
            result += 50;
        }
        if (imc > 40 && imc <= 43) {
            result += 75;
        }
        if (imc > 43 && imc <= 45) {
            result += 125;
        }
        if (imc > 45 && imc <= 46) {
            result += 175;
        }
        if (imc > 46) {
            result += -1;
        }
    }
    return result;







}
function calcImcILT(imc, age) {
    let result = 0;
    if (age <= 34) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 50;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 50;
        }
        if (imc > 32 && imc <= 34) {
            result += 75;
        }
        if (imc > 34 && imc <= 37) {
            result += 100;
        }
        if (imc > 37 && imc <= 40) {
            result += 125;
        }
        if (imc > 40 && imc <= 43) {
            result += 150;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
    if (age > 34 && age <= 55) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 25;
        }
        if (imc > 30 && imc <= 32) {
            result += 50;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 75;
        }
        if (imc > 37 && imc <= 40) {
            result += 100;
        }
        if (imc > 40 && imc <= 43) {
            result += 125;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
    if (age > 55) {
        if (imc <= 16) {
            result += 999; // rechazar
        }
        if (imc > 16 && imc <= 18) {
            result += 25;
        }
        if (imc > 18 && imc <= 21) {
            result += 0;
        }
        if (imc > 21 && imc <= 28) {
            result += 0;
        }
        if (imc > 28 && imc <= 30) {
            result += 0;
        }
        if (imc > 30 && imc <= 32) {
            result += 25;
        }
        if (imc > 32 && imc <= 34) {
            result += 50;
        }
        if (imc > 34 && imc <= 37) {
            result += 50;
        }
        if (imc > 37 && imc <= 40) {
            result += 75;
        }
        if (imc > 40 && imc <= 43) {
            result += 100;
        }
        if (imc > 43 && imc <= 45) {
            result += 999;
        }
        if (imc > 45 && imc <= 46) {
            result += 999;
        }
        if (imc > 46) {
            result += 999;
        }
    }
    return result;

}



// TO BE DONE
export function calcImc(imc, age) {
    let imcLife = calcImcLife(imc, age);
    let imcILT = calcImcILT(imc, age);

    return {
        life: imcLife,
        disability: imcLife,
        accident: imcLife,
        serious_illness: imcLife,
        ilt: imcILT
    }
}

// colors
export function setImcColor(input, val) {
    input.classList.remove("blue", "green", "red",);

    if (val < 20) {
        input.classList.add("blue");
        return false;
    }
    if (val >= 20 && val <= 28) {
        input.classList.add("green");
        return false;
    }
    if (val > 28) {
        input.classList.add("red");
        return false;
    }

}