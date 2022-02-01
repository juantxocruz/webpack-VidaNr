
let self = document;

let modal_result = self.getElementById("modal_result");
let close_modal_result = self.getElementById("close_modal_result");



let dictionary = [{ "key": "date", "value": "fecha" },
{ "key": "age", "value": "edad" },
{ "key": "gender", "value": "género" },
{ "key": "male", "value": "Hombre" },
{ "key": "female", "value": "Mujer" },
{ "key": "diabetes", "value": "diabetes" },
{ "key": "t1", "value": "tipo 1" },
{ "key": "t2", "value": "tipo 2" },
{ "key": "yearsDiabetes", "value": "años de tratamiento de diabetes" },
{ "key": "weigth", "value": "peso" },
{ "key": "height", "value": "pltura" },
{ "key": "imc", "value": "índice de masa muscular" },
{ "key": "cigarettes", "value": "cigarrillo" },
{ "key": "cigars", "value": "puro" },
{ "key": "pipes", "value": "pipa" },
{ "key": "wines", "value": "vino" },
{ "key": "beers", "value": "cerveza" },
{ "key": "spirits", "value": "licor" },
{ "key": "systolic_1", "value": "sistólica" },
{ "key": "diastolic_1", "value": "diastólica" },
{ "key": "systolic_2", "value": "sistólica" },
{ "key": "diastolic_2", "value": "diastólica" },
{ "key": "insulin", "value": "insulina" },
{ "key": "ins1", "value": "Hasta 25 unidades diarias de insulina" },
{ "key": "ins2", "value": "Más de 25 unidades diarias de insulina" },
{ "key": "hemoglobin", "value": "hemoglobina" },
{ "key": "hem1", "value": "Menos de 7,0" },
{ "key": "hem2", "value": "De 7,0 a 7,5" },
{ "key": "hem3", "value": "De 7,6 a 8,0" },
{ "key": "hem4", "value": "De 8,1 a 9,0" },
{ "key": "hem5", "value": "De 9,1 a 10" },
{ "key": "hem6", "value": "Más de 10" },
{ "key": "cholesterol", "value": "colesterol" },
{ "key": "cho0", "value": "Hasta 240" },
{ "key": "cho1", "value": "De 241 a  270" },
{ "key": "cho2", "value": "De 271 a  300" },
{ "key": "cho3", "value": "De 301 a 375" },
{ "key": "cho4", "value": "De 376 a 450" },
{ "key": "cho5", "value": "Más de 450" }
];



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



function getDictionaryWord(key) {
    return dictionary.filter(d => d.key === key);
}



function getAlcohol(beers, wines, spirits) {
    let result = '';
    if (beers === 0 && wines === 0 && spirits === 0) {
        result += 'No consume alcohol';
        return result;
    } else {
        if (beers === 0 || beers > 1) {
            result += beers + ' cervezas + | ';
        }
        if (beers === 1) {
            result += '1 cerveza | ';
        }
        if (wines === 0 || wines > 1) {
            result += wines + ' vinos + | ';
        }
        if (wines === 1) {
            result += '1 vino | ';
        }
        if (spirits === 0 || spirits > 1) {
            result += spirits + ' licores';
        }
        if (spirits === 1) {
            result += '1 licor';
        }
    }
    return result;
};

function getTobacco(cigarettes, cigars, pipes) {
    let result = '';
    if (cigarettes === 0 && cigars === 0 && pipes === 0) {
        result += 'No consume tabaco';
        return result;
    } else {
        if (cigarettes === 0 || cigarettes > 1) {
            result += cigarettes + ' cigarrillos | ';
        }
        if (cigarettes === 1) {
            result += '1 cigarrillo | ';
        }

        if (cigars === 0 || cigars > 1) {
            result += cigars + ' puros | ';
        }
        if (cigars === 1) {
            result += '1 puro | ';
        }

        if (pipes === 0 || pipes > 1) {
            result += pipes + ' pipas';
        }
        if (pipes === 1) {
            result += pipes + ' pipa';
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

    if (insurance[key] > 999) {
        return '<span class="red">Rechazar</span>';
    } else {
        let sum = data.alcohol[key] + data.cholesterol + data.imc[key] + data.tension + data.tobacco[key];

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
    table += '<td>IMC</td>';
    table += ' <td>' + getPartialResult(data.imc[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>Tabaco</td>';
    table += ' <td>' + getPartialResult(data.tobacco[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>Alcohol</td>';
    table += ' <td>' + getPartialResult(data.alcohol[key]) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>Tensión</td>';
    table += ' <td>' + getPartialResult(data.tension) + '</td>';
    table += ' </tr>';


    table += '<tr>';
    table += '<td>Colesterol</td>';
    table += ' <td>' + getPartialResult(data.cholesterol) + '</td>';
    table += ' </tr>';

    table += '<tr>';
    table += '<td>Recargo</td>';
    table += ' <td>' + getSurcharge(data, $insurance, key) + '</td>';
    table += ' </tr>';

    table += '</table>';

    return table;

}



export function openModalResults(event, _vars, $results, $insurance, $inMax) {
    event.stopPropagation();

    // vars
    let newDate = new Date(_vars.today);
    let year = newDate.getFullYear();
    let today = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear() + ' a las ' + (newDate.getUTCHours() + 1) + ':' + newDate.getUTCMinutes() + 'h.';
    let gender = getDictionaryWord(_vars.gender)[0].value;
    let bornDate = new Date(_vars.date);
    let date = bornDate.getDate() + '/' + (bornDate.getMonth() + 1) + '/' + bornDate.getFullYear() + '';
    let age = _vars.age.regular + ' años';
    let actuarial = _vars.age.actuarial + ' años';
    let height = _vars.height + ' cm';
    let weight = _vars.weight + ' kg';
    let imc = _vars.imc + ' imc';
    let systolic = _vars._hypertension_mean.systolic + ' sistólica';
    let diastolic = _vars._hypertension_mean.diastolic + ' diastólica';
    let cholesterol = getDictionaryWord(_vars.cholesterol)[0].value + ' colesterol';
    let alcohol = getAlcohol(parseInt(_vars.beers), parseInt(_vars.wines), parseInt(_vars.spirits));
    let tobacco = getTobacco(parseInt(_vars.cigarettes), parseInt(_vars.cigars), parseInt(_vars.pipes));


    let constitution = gender + ' | ' + date + ' | ' + age + ' (real) | ' + actuarial + ' (actuarial) | ' + height + ' | ' + weight + ' | ' + imc;
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


    // print
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

