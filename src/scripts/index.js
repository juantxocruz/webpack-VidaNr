import '../styles/index.scss';


import {
  addEventListenerList,
  calculate_age,
  dateIsHigher,
  subtractYearsToDate,
  dateIsOnRange,
  isNumberKey,
  limitChars,
  cmToMeter
} from './helpers';

import { calcAlcohol } from './alcohol_calc';
import { calcCholesterol } from './cholesterol_calc';
import { calcFactor } from './factor_calc';
import {
  getHypertensionMean,
  setSystolicColors,
  setDiastolicColors,
  setHypertensionResume,
  setHypertensionPhrase,
  hypertensionFieldsOn,
  hypertensionMsgOff,
  isCompensatedTension,
  isNotCompensatedTension,
  calcHypertension
} from './hypertension_calc';

import { calcInsurance, calcInMax } from './insurance_calc';
import { openModalResults, initModalResults } from './modal_results';
import { modalSetup, openModalWindow, initModalWindow } from './modal_window';
import { calcTension } from './tension_matrix_calc';
import { calcTobacco } from './tobacco_calc';
import { calcImc, setImcColor } from './imc_calc';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}








let formForm = document.forms["vidanr_form"];
let vidanr_cal = document.getElementById('vidanr_cal');

let numericFields = formForm.querySelectorAll('input[type="number"]');
let genderField = formForm.elements['gender'];
let dateFields = formForm.querySelectorAll('input[type="date"]');
let body_mass = formForm.elements['body_mass'];
let $systolic = formForm.elements['systolic'];
let $diastolic = formForm.elements['diastolic'];


let birthdayModalSetup = {
  header: "Fecha incorrecta",
  content: "La fecha seleccionada no puede ser mayor que la fecha actual.",
  action: "Por favor, escoga una fecha de nuevo",
  footer: "© NacionalRe. Todos los derechos reservados."
}




const dateRange = [13, 69];
const minHeight = 120;
const minWeight = 32;
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const systolicRange = [75, 200];
const diastolicRange = [45, 124];



let dateRangeModalSetup = {
  header: "Atención: Fecha fuera de rango",
  content: "Por favor, escoga una fecha en el rango (entre " + dateRange[0] + " y " + dateRange[1] + " años de edad).",
  action: "La fecha seleccionada debe estar entre el " + subtractYearsToDate(new Date(), dateRange[1]).toLocaleDateString('es-ES', dateOptions) + " y el " + subtractYearsToDate(new Date(), dateRange[0]).toLocaleDateString('es-ES', dateOptions) + ".",
  footer: "© NacionalRe"
}

let fieldsOffModalSetup = {
  header: "Atención:",
  content: "Por favor, rellene correctamente los campos con mensajes en rojo.",
  action: "Existen campos erróneos o sin rellenar.",
  footer: "© NacionalRe"
}

let imcRefuseSetup = {
  header: "Rechazar:",
  content: "Debido a la relación peso/altura esta solicitud debe ser rechazada.",
  action: "Ingrese nuevos datos o rechace la solicitud.",
  footer: "© NacionalRe"
}
let imcPostponeSetup = {
  header: "Aplazar:",
  content: "Debido a la relación peso/altura esta solicitud debe ser aplazada.",
  action: "Ingrese nuevos datos o aplace la solicitud.",
  footer: "© NacionalRe"
}
let tensionRefuseSetup = {
  header: "Rechazar:",
  content: "Debido a la tensión arterial esta solicitud debe ser rechazada.",
  action: "Ingrese nuevos datos o rechace la solicitud.",
  footer: "© NacionalRe"
}
let inMaxRefuseSetup = {
  header: "Consulte con la central:",
  content: "Se ha excedido el límite para el cálculo de vida y este supuesto aborta el cálculo de cualquier riesgo.",
  action: "Ingrese nuevos datos o consulte con la central.",
  footer: "© NacionalRe"
}



// global results
let _today = new Date();
let _age = {};
let _date = formForm.elements['birthday'].value;
let _gender = formForm.elements['gender'].value;
let _weight = formForm.elements['weight'].value;
let _height = formForm.elements['height'].value;
let _imc = formForm.elements['body_mass'].value;
let _cigarettes = formForm.elements['cigarettes'].value;
let _cigars = formForm.elements['cigars'].value;
let _pipes = formForm.elements['pipes'].value;
let _wines = formForm.elements['wines'].value;
let _beers = formForm.elements['beers'].value;
let _spirits = formForm.elements['spirits'].value;
let _hypertension_mean = {};
let _systolic_1 = formForm.elements['systolic_1'].value;
let _diastolic_1 = formForm.elements['diastolic_1'].value;
let _systolic_2 = formForm.elements['systolic_2'].value;
let _diastolic_2 = formForm.elements['diastolic_2'].value;
let _cholesterol = formForm.elements['cholesterol'].value;
let _formInputs = {};


let $result = {
  alcohol: {},
  cholesterol: 0,
  imc: {},
  tension: 0,
  tobacco: {}

};
// old nagra
let $factor = {
  life: null,
  ilt: null
};
let $insurance = {
  accident: false,
  disability: false,
  ilt: false,
  life: false,
  serious_illness: false
}
let $inMax = false;






function getFormInputs() {
  return {
    date: _date,
    age: _age,
    gender: _gender,
    weight: _weight,
    height: _height,
    imc: _imc,
    cigarettes: _cigarettes,
    cigars: _cigars,
    pipes: _pipes,
    wines: _wines,
    beers: _beers,
    spirits: _spirits,
    systolic_1: _systolic_1,
    diastolic_1: _diastolic_1,
    systolic_2: _systolic_2,
    diastolic_2: _diastolic_2,
    _hypertension_mean: _hypertension_mean,
    cholesterol: _cholesterol,
    today: _today
  }
}



function setSubmitButtonState() {
  let button = document.getElementById('submit_button');
  if (fieldsOn()["length"] === 0) {
    return button.classList.add("fieldsOn");
  }
  else {
    return button.classList.remove("fieldsOn");
  }


}

function radioButtonOn(list) {
  let wrongFields = [];
  list.forEach((l) => {
    let fields = document.getElementsByName(l);
    let wrongTemp = [];
    fields.forEach((f) => {
      if (f.checked === false) {
        wrongTemp.push(f);
      }
    })
    if (wrongTemp.length === fields.length) { wrongFields.push(fields) };
  })
  return wrongFields.length > 0 ? false : true;
}



// CHECK ALL FIELDS FUNCTIONS
function fieldsOn() {

  let nodeList = formForm.querySelectorAll('input[type="number"], input[type="date"], input[type="checkbox"], input[type="radio"]');
  let hypertensionFields = [];
  let wrongFields = [];
  let i = 0;
  for (i = 0; i < nodeList.length; i++) {
    if (nodeList[i].type === "checkbox" && nodeList[i].checked) {
      wrongFields.push(
        {
          type: nodeList[i].type,
          list: nodeList[i]
        });
    }
    if ((nodeList[i].type === "date" || nodeList[i].type === "number") && nodeList[i].value === "" && nodeList[i].dataset.type !== 'hypertension') {
      wrongFields.push({
        type: nodeList[i].type,
        list: nodeList[i]
      });
    }
    if (nodeList[i].type === "number" && nodeList[i].dataset.type === 'hypertension') {
      hypertensionFields.push(nodeList[i]);
    }
  }

  // At least one tension is present
  if (!hypertensionFieldsOn(hypertensionFields)) {
    wrongFields.push(hypertensionFields);
  };
  // there is no hypertension red block messages on the screen
  if (!hypertensionMsgOff()) {
    wrongFields.push({});
  }
  // tension resume phrase is green and 'Compensada'
  if (!isCompensatedTension()) {
    wrongFields.push({ type: "isCompensatedTension" });
  }

  if (!radioButtonOn(["gender", "cholesterol"])) {
    wrongFields.push({ type: "radioButtonOn" });
  }

  return wrongFields;
}

function resetNodeFields(nodeList) {

  let i = 0;
  if (nodeList && nodeList.length > 0) {
    for (i = 0; i < nodeList.length; i++) {
      document.getElementById(nodeList[i].name + "_msg").style.display = "none";
    }

  }

}
function resetInnerHtml(elId) {
  document.getElementById(elId).innerHTML = '';
}
function checkNodeFields(nodeList) {
  let i = 0;
  for (i = 0; i < nodeList.length; i++) {
    if (nodeList[i].type === "checkbox" && nodeList[i].checked) {
      document.getElementById(nodeList[i].name + "_msg").style.display = "block";
    }

    if (nodeList[i].type === "radio" && nodeList.value === "") {
      document.getElementById(nodeList[i].name + "_msg").style.display = "block";
    }

    if ((nodeList[i].type === "date" || nodeList[i].type === "number") && nodeList[i].value === "" && nodeList[i].dataset.type !== 'hypertension') {
      document.getElementById(nodeList[i].name + "_msg").style.display = "block";
    }
  }
}

function checkTensionFields(tension) {

  // we are here checking the messsages --> fix beetween checkTensionFields && toogleMandatoryMs
  // We think message jumps before value
  let completed = [];
  let not_completed = [];
  let firstRound = true;

  tension.forEach((t) => {
    if (t.systolic != "" && t.diastolic != "") {
      t.completed = true
      completed.push(t);
    } else {
      t.completed = false;
      not_completed.push(t);
    }
  });

  // both completed ok
  if (completed.length > 1) {
    return true;
  }

  // Only one completed
  if (completed.length === 1) {
    let notCompleted = not_completed[0];
    let notCompletedIndex = notCompleted.index;
    if (notCompleted.systolic === '' && notCompleted.diastolic === '') {
      return true;
    }

    if (notCompleted.systolic === '') {
      document.getElementById("systolic_" + (notCompletedIndex) + "_msg").style.display = "block";
    }
    if (notCompleted.diastolic === '') {
      document.getElementById("diastolic_" + (notCompletedIndex) + "_msg").style.display = "block";
    }
    return true;
  }


  not_completed.forEach((t, index) => {
    if (t.systolic === '' && t.diastolic === '') {

      if (firstRound) {
        document.getElementById("systolic_" + (index + 1) + "_msg").style.display = "block";
        document.getElementById("diastolic_" + (index + 1) + "_msg").style.display = "block";

      } else {
        document.getElementById("systolic_" + (index + 1) + "_msg").style.display = "none";
        document.getElementById("diastolic_" + (index + 1) + "_msg").style.display = "none";
      }

    }
    if (t.systolic === '' && t.diastolic !== '') {
      // first round!
      document.getElementById("systolic_" + (index + 1) + "_msg").style.display = "block";
      document.getElementById("diastolic_" + (index + 1) + "_msg").style.display = "none";
    }
    if (t.systolic !== '' && t.diastolic === '') {
      document.getElementById("diastolic_" + (index + 1) + "_msg").style.display = "block";
      document.getElementById("systolic_" + (index + 1) + "_msg").style.display = "none";
    }
    firstRound = false;
    return false;
  })

}

// Event listeners

// Only numeric values on fields, no comma, no dot, no paste, no drop.
function setNumericField() {
  let fields = formForm.querySelectorAll('input[type="number"]');
  addEventListenerList(fields, "keypress", (e) => {
    isNumberKey(e)
    limitChars(e)
  });
  addEventListenerList(fields, "paste", (e) => { e.preventDefault(); return false; });
  addEventListenerList(fields, "drop", (e) => { e.preventDefault(); return false; });
  addEventListenerList(fields, "change", (e) => { toggleMandatoryMsg(e) });
}


function toggleHypertensionMsg(e) {

  if ((e.currentTarget.type === "number") && e.currentTarget.dataset.type === 'hypertension') {
    let tension = e.currentTarget.name.split('_')[0];
    let next = tension === 'systolic' ? 'diastolic' : 'systolic';
    let position = e.currentTarget.name.split('_')[1]; // "1" or "2"

    if (e.currentTarget.value !== "") {
      document.getElementById(e.currentTarget.name + "_msg").style.display = "none";

      if (document.getElementById(next + '_' + position).value !== '') {
        document.getElementById(next + '_' + position + "_msg").style.display = "none";
      } else {
        document.getElementById(next + '_' + position + "_msg").style.display = "block";
      }

      return false;

    }
    if (e.currentTarget.value === "") {
      if (document.getElementById(next + '_' + position).value !== '') {
        document.getElementById(e.currentTarget.name + "_msg").style.display = "block";
      } else {
        document.getElementById(e.currentTarget.name + "_msg").style.display = "none";
        document.getElementById(next + '_' + position + "_msg").style.display = "none";
      }
      return false;
    }
  }
}

function toggleMandatoryMsg(e) {

  if ((e.currentTarget.type === "number") && e.currentTarget.dataset.type === 'hypertension') {
    return false;
  }

  if ((e.currentTarget.type === 'date' || e.currentTarget.type === "number" || e.currentTarget.type === 'radio') && e.currentTarget.value !== "" && e.currentTarget.dataset.type !== 'hypertension') {
    document.getElementById(e.currentTarget.name + "_msg").style.display = "none";
    return false;
  }

  if (e.currentTarget.type === 'checkbox' && !e.currentTarget.checked) {
    let boxes = document.getElementsByName(e.currentTarget.name);
    let checked = Array.prototype.slice.call(boxes).filter(d => d.checked);
    if (checked.length < 1) {
      document.getElementById(e.currentTarget.name + "_msg").style.display = "none";
      return false;
    }
  }
  document.getElementById(e.currentTarget.name + "_msg").style.display = "block";
  return false;
}


// INIT INPUTS 


function initBirthday() {
  // 2. Birthday and age
  let birthdayInput = formForm.elements['birthday'];
  birthdayInput.onblur = (e) => {
    _date = new Date(e.currentTarget.value);
    if (!dateIsHigher(_date)) {
      if (dateIsOnRange(dateRange, _date)) {
        _age = calculate_age(new Date(e.currentTarget.value));
        document.getElementById("birthday_msg").style.display = "none";
      } else {
        openModalWindow(e, dateRangeModalSetup);
        e.currentTarget.value = "";
        document.getElementById("birthday_msg").style.display = "block";
      }
    }
    else {
      openModalWindow(e, birthdayModalSetup);
      e.currentTarget.value = "";
      document.getElementById("birthday_msg").style.display = "block";
    }
    setSubmitButtonState();
  }
}


function initRadioButtons(name) {
  let input = formForm.elements[name];
  addEventListenerList(input, "change", (e) => {
    toggleMandatoryMsg(e);
    switch (name) {
      case 'gender':
        _gender = e.currentTarget.value; // male, female
        break;
      case 'cholesterol':
        _cholesterol = e.currentTarget.value; // cho1, cho2... cho5
        // to move
        $result.cholesterol = calcCholesterol(_cholesterol, _age.actuarial);
        let w;
        break;
      default:
        return "";
    }
    setSubmitButtonState();


  });
}



function setBodyMassField() {

  if (_weight !== "" && _height !== "") {
    let w = cmToMeter(Number(_height));
    _imc = (Number(_weight) / (Number(w) * Number(w))).toFixed(2);
    body_mass.value = _imc;
    setImcColor(body_mass, _imc);
    // to move
    $result.imc = calcImc(_imc, Number(_age.actuarial));


  }
  else {
    body_mass.value = '';


  }
}
function initNumericField(name) {
  let input = formForm.elements[name];
  let parser;
  input.addEventListener("blur", (e) => {
    switch (name) {

      case 'weight':

        _weight = e.currentTarget.value; // string 
        parser = !!parseInt(_weight) ? parseInt(_weight) : 0;
        if (parser <= minWeight) {
          modalSetup.content = 'El peso introducido es muy bajo. Debe introducir un peso mayor de ' + minWeight + ' kilos.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."

          if (_weight !== '') {
            openModalWindow(e, modalSetup);

          }
          _weight = '';
          e.currentTarget.value = '';
          body_mass.value = '';


        } else {
          if (_weight !== '' && _height !== '') {
            setBodyMassField();
          }

        }

        break;
      case 'height':
        _height = e.currentTarget.value; // string d
        parser = !!parseInt(_height) ? parseInt(_height) : 0;
        if (parser <= minHeight) {
          modalSetup.content = 'La altura introducida es muy baja. Debe introducir una altura mayor de ' + minHeight + ' centímetros.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."
          _height = '';
          e.currentTarget.value = '';
          body_mass.value = '';
          openModalWindow(e, modalSetup);

        } else {
          if (_weight !== '' && _height !== '') {
            setBodyMassField();
          }
        }

        break;
      case 'cigarettes':
        _cigarettes = e.currentTarget.value; // string 
        break;
      case 'cigars':
        _cigars = e.currentTarget.value; // string 
        break;
      case 'pipes':
        _pipes = e.currentTarget.value; // string 
        // to move
        $result.tobacco = calcTobacco(Number(_cigarettes), Number(_cigars), Number(_pipes));

        break;
      case 'wines':
        _wines = e.currentTarget.value; // string 
        break;
      case 'beers':
        _beers = e.currentTarget.value; // string 
        break;
      case 'spirits':
        _spirits = e.currentTarget.value; // string
        $result.alcohol = calcAlcohol(Number(_wines), Number(_beers), Number(_spirits), _gender, _age.actuarial);

        break;
      case 'systolic_1':
      case 'systolic_2':

        let _systolic = e.currentTarget.value; // string 

        if (parseInt(_systolic) > systolicRange[1]) {
          modalSetup.content = 'La tensión sistólica es muy alta para asegurar el riesgo. Debe introducir una tensión diástolica menor de ' + systolicRange[1] + '.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."
          openModalWindow(e, modalSetup);
          e.currentTarget.value = '';
        }

        if (parseInt(_systolic) < systolicRange[0]) {
          modalSetup.content = 'La tensión sistólica es muy baja para asegurar el riesgo. Debe introducir una tensión diástolica mayor de ' + systolicRange[0] + '.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."
          openModalWindow(e, modalSetup);
          e.currentTarget.value = '';

        }
        toggleHypertensionMsg(e);
        _systolic_1 = name === 'systolic_1' ? e.currentTarget.value : _systolic_1;
        _systolic_2 = name === 'systolic_2' ? e.currentTarget.value : _systolic_2;
        _hypertension_mean = getHypertensionMean(_systolic_1, _diastolic_1, _systolic_2, _diastolic_2);

        setSystolicColors(formForm.elements[name], _systolic);
        setHypertensionResume(_hypertension_mean, $systolic, $diastolic);
        setHypertensionPhrase(_hypertension_mean);
        setSystolicColors($systolic, $systolic.value);

        break;
      case 'diastolic_1':
      case 'diastolic_2':

        let _diastolic = e.currentTarget.value; // string

        if (parseInt(_diastolic) > diastolicRange[1]) {
          modalSetup.content = 'La tensión diastólica es muy alta para asegurar el riesgo. Debe introducir una tensión diástolica menor de ' + diastolicRange[1] + '.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."
          openModalWindow(e, modalSetup);
          e.currentTarget.value = '';

        }
        if (parseInt(_diastolic) < diastolicRange[0]) {
          modalSetup.content = 'La tensión diastólica es muy baja para asegurar el riesgo. Debe introducir una tensión diástolica mayor de ' + diastolicRange[0] + '.';
          modalSetup.action = "Por favor, asegúrese de que la cifra es correcta."
          openModalWindow(e, modalSetup);
          e.currentTarget.value = '';

        }

        toggleHypertensionMsg(e);
        _diastolic_1 = name === 'diastolic_1' ? e.currentTarget.value : _diastolic_1;
        _diastolic_2 = name === 'diastolic_2' ? e.currentTarget.value : _diastolic_2;
        _hypertension_mean = getHypertensionMean(_systolic_1, _diastolic_1, _systolic_2, _diastolic_2);


        setDiastolicColors(formForm.elements[name], _diastolic);
        setHypertensionResume(_hypertension_mean, $systolic, $diastolic);
        setHypertensionPhrase(_hypertension_mean);
        setDiastolicColors($diastolic, $diastolic.value);

        break;
      default:
        return "";

    }
    setSubmitButtonState();
  });
}


function initForm() {

  setNumericField();
  initRadioButtons('gender');
  initRadioButtons('cholesterol');
  initBirthday();
  initNumericField("weight");
  initNumericField("height");
  initNumericField("cigarettes");
  initNumericField("cigars");
  initNumericField("pipes");
  initNumericField("wines");
  initNumericField("beers");
  initNumericField("spirits");
  initNumericField("systolic_1");
  initNumericField("diastolic_1");
  initNumericField("systolic_2");
  initNumericField("diastolic_2");
}


function resultOn(result) {
  // result.alcohol.life === 999 || result.alcohol.ilt === 999 || 
  if (result.tension === -1 || result.imc.life === -1 || result.imc.life === -2 || result.imc.ilt === 999) {
    return false;
  }
  return true;
}

function checkModals(e, result) {

  if (result.tension === -1) {
    openModalWindow(e, tensionRefuseSetup);
  }
  if (result.imc.life === -2) {
    openModalWindow(e, imcPostponeSetup);
  }
  if (result.imc.life === -1) {
    openModalWindow(e, imcRefuseSetup);
  }
  return false;

}
function initSubmit() {

  // submit
  formForm.onsubmit = (e) => {
    e.preventDefault();

    checkNodeFields(formForm.elements['gender']);
    checkNodeFields(formForm.elements['cholesterol']);
    checkNodeFields(numericFields);
    checkNodeFields(dateFields);

    checkTensionFields([
      {

        'index': '1',
        'systolic': formForm.elements['systolic_1'].value,
        'diastolic': formForm.elements['diastolic_1'].value,
        'completed': null
      },

      {
        'index': '2',
        'systolic': formForm.elements['systolic_2'].value,
        'diastolic': formForm.elements['diastolic_2'].value,
        'completed': null
      }]
    );


    let fields = fieldsOn();

    if (fields["length"] === 0) {


      // vars from form
      _formInputs = getFormInputs();

      // results
      $result.imc = calcImc(_imc, Number(_age.actuarial));
      $result.tobacco = calcTobacco(Number(_cigarettes), Number(_cigars), Number(_pipes));
      $result.alcohol = calcAlcohol(Number(_wines), Number(_beers), Number(_spirits), _gender, _age.actuarial);
      $result.cholesterol = calcCholesterol(_cholesterol, _age.actuarial);
      $result.tension = calcTension(_age, _hypertension_mean);

      if (!resultOn($result)) {
        checkModals(e, $result);
        return false;
      }

      $factor = calcFactor($result);
      $insurance = calcInsurance($result, $factor);
      $inMax = calcInMax($factor);

      if ($insurance.life > $inMax) {
        openModalWindow(e, inMaxRefuseSetup);
        return false;
      }


      // OPEN results
      openModalResults(e, _formInputs, $result, $insurance, $inMax);

    } else {
      if (fields && fields["length"] === 1 && fields[0].type === 'isCompensatedTension') {
        modalSetup.header = 'Tarificación cancelada.';
        modalSetup.content = 'La diferencia entre la tensión sistólica y la tensión diástolica es menor de 20 y, por tanto, está muy descompensada.';
        modalSetup.action = "Por favor, asegúrese de que la cifra es correcta para poder realizar la tarificación.";
        openModalWindow(e, modalSetup);
        return false;

      }

      openModalWindow(e, fieldsOffModalSetup);
      return false;
    }
  }
}

function initReset() {

  // submit
  formForm.onreset = (e) => {
    resetNodeFields(formForm.elements['gender']);
    resetNodeFields(formForm.elements['cholesterol']);
    resetNodeFields(numericFields);
    resetNodeFields(dateFields);
    resetInnerHtml('hypertension_msg');
  }
}
function disableEnter() {

  vidanr_cal.addEventListener('keydown', (e) => {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13 || e.code == 'Enter' || e.which == 13) {
      if (e.target.nodeName == 'INPUT') {
        e.preventDefault();
        let form = e.target.form;
        let index = Array.prototype.indexOf.call(form, e.target);
        if (index < 37) {
          form.elements[index + 1].focus();
        }
        return false;
      }
    }
  },
    true);
}


let init = () => {
  initForm();
  initModalWindow();
  initModalResults();
  initSubmit();
  initReset();
  disableEnter();



};

init();

