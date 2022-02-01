



export function calcCholesterol(cholesterol, age) {
    let result = 0; // cho0 - Hasta 240


    if (age <= 29) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 200;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 100;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 75;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 50;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 25;
        }



    }
    if (age > 29 && age <= 49) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 150;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 75;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 50;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 25;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }

    }
    if (age > 49 && age <= 59) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 100;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 50;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 25;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 0;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }

    }
    if (age > 59) {
        if (cholesterol === 'cho5') { // +Más de 450
            result += 75;
        }
        if (cholesterol === 'cho4') { // de 376 a 450
            result += 25;
        }
        if (cholesterol === 'cho3') { // de 301 a 375
            result += 0;
        }
        if (cholesterol === 'cho2') { // de 271 a  300
            result += 0;
        }
        if (cholesterol === 'cho1') { // de 241 a  270
            result += 0;
        }

    }
    result += 0; // cho0
    return result; // 'cho0' Menos de 240
}


