import { idiom } from './index';
import { getDictionaryWord, setFormDictionary } from './dictionary';

let self = document;

let modal_result = self.getElementById("modal_result");
let close_modal_result = self.getElementById("close_modal_result");
let life_expectancy_container = self.getElementById("life_expectancy_container");
let result_today = self.getElementById('result_today');
let result_year = self.getElementById('result_year');
let result_vars_constitution = self.getElementById('result_vars_constitution');
let result_vars_medical = self.getElementById('result_vars_medical');
let result_vars_drugs = self.getElementById('result_vars_drugs');
let result_insurance_life = self.getElementById('result_insurance_life');
let result_insurance_disability = self.getElementById('result_insurance_disability');
let result_insurance_accident = self.getElementById('result_insurance_accident');
let result_insurance_illness = self.getElementById('result_insurance_illness');
let result_insurance_ilt = self.getElementById('result_insurance_ilt');
let result_table_life = self.getElementById('result_table_life');
let result_table_disability = self.getElementById('result_table_disability');
let result_table_accident = self.getElementById('result_table_accident');
let result_table_illness = self.getElementById('result_table_illness');

let result_table_ilt = self.getElementById('result_table_ilt');


// functions
// MODAL WINDOW
export function initModalResults() {
    close_modal_result.onclick = function () {
        modal_result.style.display = "none";
    }
}



function getAlcohol(beers, wines, spirits) {
    let result = '';
    if (beers === 0 && wines === 0 && spirits === 0) {
        result += getDictionaryWord('not_consume_alcohol');
        return result;
    } else {
        if (beers === 0 || beers > 1) {
            result += beers + ' ' + getDictionaryWord('beer') + 's | ';
        }
        if (beers === 1) {
            result += '1 ' + getDictionaryWord('beer') + ' | ';
        }
        if (wines === 0 || wines > 1) {
            result += wines + ' ' + getDictionaryWord('wine') + 's | ';
        }
        if (wines === 1) {
            result += '1 ' + getDictionaryWord('wine') + ' | ';
        }
        if (spirits === 0 || spirits > 1) {
            result += spirits + ' ' + getDictionaryWord('liqueur') + 's | ';
        }
        if (spirits === 1) {
            result += '1 ' + getDictionaryWord('liqueur');
        }
    }
    return result;
};

function getTobacco(cigarettes, cigars, pipes) {
    let result = '';
    if (cigarettes === 0 && cigars === 0 && pipes === 0) {
        result +=  getDictionaryWord('not_consume_tobacco');
        return result;
    } else {
        if (cigarettes === 0 || cigarettes > 1) {
            result += cigarettes + ' ' + getDictionaryWord('cigarette') + 's | ';
        }
        if (cigarettes === 1) {
            result += '1 ' + getDictionaryWord('cigarette') + ' | ';
        }

        if (cigars === 0 || cigars > 1) {
            result += cigars +  ' ' + getDictionaryWord('cigar') + 's | ';
        }
        if (cigars === 1) {
            result += '1 ' + getDictionaryWord('cigar') + ' | ';
        }

        if (pipes === 0 || pipes > 1) {
            result += pipes + ' ' + getDictionaryWord('pipe') + 's';
        }
        if (pipes === 1) {
            result += pipes + ' '+ getDictionaryWord('pipe');
        }

    }
    return result;
};

// results from raw excel tables, with no factor calculations
function getPartialResult(number) {
    if (number > 300) {
        return '<span class="red">Rechazar</span>';
    }
    if (number === 0) {
        return '<span class="green">Normal</span>';
    }
    if (number > 0) {

        return '<span class="red"> +' + number + '%</span>';
    }

}


function getInsurance(data, key) {
    return getPartialResult(+data[key]);
}

function getSurcharge(data, insurance, key) {
    let sum = 0;

    if (insurance[key] > 999) {
        return '<span class="red">Rechazar</span>';
    } else {
        if (key === 'accident') {
            sum = data.alcohol[key] + data.cholesterol + data.imc[key] / 2 + data.tension + data.tobacco[key];
        } else {
            sum = data.alcohol[key] + data.cholesterol + data.imc[key] + data.tension + data.tobacco[key];
        }


        if (sum > insurance[key]) {
            return '<span class="green">' + (insurance[key] - sum) + '%</span>';
        }
        if (sum < insurance[key]) {
            return '<span class="red"> +' + (insurance[key] - sum) + '%</span>';
        }
        if (sum === insurance[key]) {
            return '<span class="green">No</span>';
        }

    }

}

function getTableResult(data, $insurance, key) {
    let table = '';
    table += '<table class="result-table" style="width:100%">';
    table += '<tr><th </th><th></th></tr>';

    table += '<tr>';

    if (key === 'accident') {
        table += '<td>'+ getDictionaryWord('imc_initials')+ '</td>';
        table += ' <td>' + getPartialResult(data.imc[key] / 2) + '</td>';
    } else {
        table += '<td>'+ getDictionaryWord('imc_initials')+ '</td>';
        table += ' <td>' + getPartialResult(data.imc[key]) + '</td>';
    }
    //table += ' <td>' + getPartialResult(data.imc[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>'+ getDictionaryWord('tobacco_upper')+ '</td>';
    table += ' <td>' + getPartialResult(data.tobacco[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>'+ getDictionaryWord('alcohol_upper')+ '</td>';
    table += ' <td>' + getPartialResult(data.alcohol[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>'+ getDictionaryWord('pressure_upper')+ '</td>';
    table += ' <td>' + getPartialResult(data.tension) + '</td>';
    table += ' </tr>';


    table += '<tr>';
    table += '<td>'+ getDictionaryWord('cholesterol_upper')+ '</td>'
    table += ' <td>' + getPartialResult(data.cholesterol) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>'+ getDictionaryWord('cumulus_upper')+ '</td>'
    table += ' <td>' + getSurcharge(data, $insurance, key) + '</td>';
    table += ' </tr>';

    table += '</table>';

    return table;

}

function getGkTableName(gender) {

    return gender === 'm' ? "GKM95" : "GKF95";

}

function drawLifeExpectancyTable(_expectancy) {

    let table = '';
    table += '<table class="table charge-table" style="width:100%">';
    table += '<thead>';
    table += '<tr><th></th>';
    table += '<th>PASEMF 2010</th>';
    table += '<th>' + getGkTableName(_expectancy.gk95.gender) + '<br></th>';
    // table += '<th>GKM95<br></th>';
    table += '</tr>';
    table += '</thead>';
    table += '<tbody>';
    table += '</tr>';
    table += '<td>' + 'Normal' + '</td>';
    table += ' <td>' + _expectancy.gk80.expectancy + ' años</td>';
    table += ' <td>' + _expectancy.gk95.expectancy + ' años</td>';
    table += '</tr>';

    if (_expectancy.gk80.charge > 0 || _expectancy.gk95.charge > 0) {
        table += '</tr>';
        table += ' <td>' + 'Agravado' + '</td>';
        table += ' <td class="red" style="font-weight:700">' + _expectancy.gk80.expectancyWithCharge + ' años</td>';
        table += ' <td class="red" style="font-weight:700">' + _expectancy.gk95.expectancyWithCharge + ' años</td>';
        table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';

    return table;


}



export function openModalResults(event, _vars, $results, $insurance, _lifeExpectancy) {
    event.stopPropagation();
    // vars

    const options = { timeZone: 'Europe/Paris', timeZoneName: 'short' };
    const stringtime = (new Date().toLocaleTimeString("es-ES", options)).split(":");

    let newDate = new Date();
    let year = newDate.getFullYear();
    let today = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear() + ' ' + getDictionaryWord('today_at') + ' ' + stringtime[0] + ':' + stringtime[1] + 'h.';
    let gender = getDictionaryWord(_vars.gender + '_upper');
    let bornDate = new Date(_vars.date);
    let date = bornDate.getDate() + '/' + (bornDate.getMonth() + 1) + '/' + bornDate.getFullYear() + '';
    let age = _vars.age.regular + ' ' + getDictionaryWord('years');
    let actuarial = _vars.age.actuarial + ' ' + getDictionaryWord('years');
    let height = _vars.height + ' '+ getDictionaryWord('cm');
    let weight = _vars.weight + ' ' + getDictionaryWord('kg');
    let imc = _vars.imc + ' ' + getDictionaryWord('imc_initials');
    let systolic = _vars._hypertension_mean.systolic + ' ' + getDictionaryWord('systolic');
    let diastolic = _vars._hypertension_mean.diastolic + ' ' + getDictionaryWord('diastolic');
    let cholesterol = getDictionaryWord('label_' + _vars.cholesterol) + ' ' + getDictionaryWord('cholesterol');
    let alcohol = getAlcohol(parseInt(_vars.beers), parseInt(_vars.wines), parseInt(_vars.spirits));
    let tobacco = getTobacco(parseInt(_vars.cigarettes), parseInt(_vars.cigars), parseInt(_vars.pipes));


    let constitution = gender + ' | ' + date + ' | ' + age + ' ('+ getDictionaryWord('date_real')  + ') | ' + actuarial + ' (' + getDictionaryWord('date_actuarial') + ') | ' + height + ' | ' + weight + ' | ' + imc;
    let medical = systolic + ' | ' + diastolic;
    let drugs = cholesterol + ' | ' + alcohol + ' | ' + tobacco;
    let insurance_life = getInsurance($insurance, 'life');
    let insurance_disability = getInsurance($insurance, 'disability');
    let insurance_accident = getInsurance($insurance, 'accident');
    let insurance_illness = getInsurance($insurance, 'serious_illness');
    let insurance_ilt = getInsurance($insurance, 'ilt');
    let table_life = getTableResult($results, $insurance, 'life');
    let table_disability = getTableResult($results, $insurance, 'disability');
    let table_accident = getTableResult($results, $insurance, 'accident');
    let table_illness = getTableResult($results, $insurance, 'serious_illness');
    let table_ilt = getTableResult($results, $insurance, 'ilt');

    // table life expectancy
    //let result_vars_charge = self.getElementById('result_vars_charge');
    let result_charge_table = self.getElementById('result_charge_table');
    let charge = $insurance.life + '%';

    /* Live Expectancy only in Spanish */
    if(idiom === "ES"){
        let lifeExpectancyTable = drawLifeExpectancyTable(_lifeExpectancy);
        result_charge_table.innerHTML = lifeExpectancyTable;
    }
    if(idiom !== 'ES'){
        life_expectancy_container.style.display = "none";
    }
   
    
    // print
    // tables vidaNR
    result_today.innerHTML = today;
    result_year.innerHTML = year;
    result_vars_constitution.innerHTML = constitution;
    result_vars_medical.innerHTML = medical;
    result_vars_drugs.innerHTML = drugs;
    result_insurance_life.innerHTML = insurance_life;
    result_insurance_disability.innerHTML = insurance_disability;
    result_insurance_accident.innerHTML = insurance_accident;
    result_insurance_illness.innerHTML = insurance_illness;
    result_insurance_ilt.innerHTML = insurance_ilt;
    result_table_life.innerHTML = table_life;
    result_table_disability.innerHTML = table_disability;
    result_table_accident.innerHTML = table_accident;
    result_table_illness.innerHTML = table_illness;
    result_table_ilt.innerHTML = table_ilt;

    modal_result.style.display = "block";
}

