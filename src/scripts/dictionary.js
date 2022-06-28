import { idiom } from './index';
export let dictionary =[{"key":"gender_upper","ES":"Género","EN":"Gender"},
{"key":"male_upper","ES":"Hombre","EN":"Man"},
{"key":"female_upper","ES":"Mujer","EN":"Woman"},
{"key":"birth_date","ES":"Fecha nacimiento","EN":"Birth date"},
{"key":"constitution","ES":"Constitución","EN":"Constitution"},
{"key":"weight_measure","ES":"Peso (kg)","EN":"Weight (kg)"},
{"key":"height_measure","ES":"Altura (cm)","EN":"Height (cm)"},
{"key":"mass_index","ES":"Índice Masa","EN":"Body Mass Index "},
{"key":"tobacco_upper","ES":"Tabaco","EN":"Tobacco"},
{"key":"alcohol_upper","ES":"Alcohol","EN":"Alcohol"},
{"key":"tobacco_daily_consumption","ES":"Consumo diario","EN":"Daily consumption"},
{"key":"alcohol_daily_consumption","ES":"Consumo diario","EN":"Daily consumption"},
{"key":"cigarettes_upper","ES":"Cigarrillos","EN":"Cigarettes"},
{"key":"cigars_upper","ES":"Puros","EN":"Cigars"},
{"key":"pipes_upper","ES":"Pipas","EN":"Pipes"},
{"key":"wines_upper","ES":"Vinos","EN":"Wines"},
{"key":"beers_upper","ES":"Cervezas","EN":"Beers"},
{"key":"liqueurs_upper","ES":"Licores","EN":"Liqueurs"},
{"key":"blood_pressure_upper","ES":"Tensión arterial","EN":"Blood pressure"},
{"key":"blood_pressure_intro","ES":"Presión arterial (mm Hg.). Teclee al menos una toma.","EN":"Blood pressure (mmHg). Type at least one take."},
{"key":"systolic_one_upper","ES":"Sistólica 1","EN":"Systolic 1"},
{"key":"diastolic_one_upper","ES":"Diastólica 1","EN":"Diastolic 1"},
{"key":"second_take","ES":"Segunda toma","EN":"Second Take"},
{"key":"systolic_two_upper","ES":"Sistólica 2","EN":"Systolic 2"},
{"key":"diastolic_two_upper","ES":"Diastólica 2","EN":"Diastolic 2"},
{"key":"abstract_upper","ES":"Resumen","EN":"Abstract"},
{"key":"systolic_zero_upper","ES":"Sistólica","EN":"Systolic"},
{"key":"diastolic_zero_upper","ES":"Diastólica","EN":"Diastolic"},
{"key":"cholesterol_total_upper","ES":"Colesterol total","EN":"Total cholesterol"},
{"key":"cholesterol_total_intro","ES":"Miligramos por decilitro (mg/dL)","EN":"Milligrams per deciliter (mg/dL)"},
{"key":"label_cho0","ES":"Hasta 240","EN":"Up to 240"},
{"key":"label_cho1","ES":"De 241 a 270","EN":"From 241 to 270"},
{"key":"label_cho2","ES":"De 271 a 300","EN":"From 271 to 300"},
{"key":"label_cho3","ES":"De 301 a 375","EN":"From 301 to 375"},
{"key":"label_cho4","ES":"De 376 a 450","EN":"From 376 to 450"},
{"key":"label_cho5","ES":"Más de 450","EN":"More than 450"},
{"key":"reset_button","ES":"Restaurar","EN":"Reset"},
{"key":"submit_button","ES":"Tarificación","EN":"Calculate"},
{"key":"mandatory_date_1","ES":"Fecha obligatoria","EN":"Mandatory Date"},
{"key":"mandatory_text_1","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_2","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_3","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_4","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_5","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_6","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_7","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_8","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_9","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_10","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_11","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_12","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_13","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_14","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"mandatory_text_15","ES":"Campo obligatorio","EN":"Mandatory field"},
{"key":"first_take","ES":"Primera toma","EN":"First Take"},
{"key":"modalSetup_header","ES":"Atención","EN":"Attention"},
{"key":"fieldsOffModalSetup_content","ES":"Por favor, rellene correctamente los campos con mensajes en rojo.","EN":"Please fill in the fields with messages in red correctly."},
{"key":"fieldsOffModalSetup_action","ES":"Existen campos erróneos o sin rellenar.","EN":"There are erroneous or unfilled fields."},
{"key":"modalSetup_footer","ES":" © NacionalRe. Todos los derechos reservados.","EN":" © NacionalRe. All rights reserved."},
{"key":"imcRefuseSetup_header","ES":"Rechazar:","EN":"Decline:"},
{"key":"imcRefuseSetup_content","ES":"Debido a la relación peso/altura esta solicitud debe ser rechazada.","EN":"Due to the weight/height ratio this request must be rejected."},
{"key":"imcRefuseSetup_action","ES":"Ingrese nuevos datos o rechace la solicitud.","EN":"Enter new data or decline the request."},
{"key":"imcPostponeSetup_header","ES":"Aplazar:","EN":"Postpone:"},
{"key":"imcPostponeSetup_content","ES":"Debido a la relación peso/altura esta solicitud debe ser aplazada.","EN":"Due to the weight/height ratio this request must be deferred."},
{"key":"imcPostponeSetup_action","ES":"Ingrese nuevos datos o aplace la solicitud.","EN":"Enter new data or defer the request."},
{"key":"tensionRefuseSetup_header","ES":"Rechazar:","EN":"Decline:"},
{"key":"tensionRefuseSetup_content","ES":"Debido a la tensión arterial esta solicitud debe ser rechazada.","EN":"Due to blood pressure this request must be refused."},
{"key":"tensionRefuseSetup_action","ES":"Ingrese nuevos datos o rechace la solicitud.","EN":"Enter new data or decline the request."},
{"key":"inMaxRefuseSetup_header","ES":"Consulte con la central:","EN":"Check with the head office:"},
{"key":"inMaxRefuseSetup_content","ES":"Se ha excedido el límite para el cálculo de vida y este supuesto aborta el cálculo de cualquier riesgo.","EN":"The limit for life calculation has been exceeded and this assumption aborts the calculation of any risk."},
{"key":"inMaxRefuseSetup_action","ES":"Ingrese nuevos datos o consulte con la central.","EN":"Enter new data or check with the central."},
{"key":"weightModalSetup_1_content","ES":"El peso introducido es muy bajo. Debe introducir un peso mayor de","EN":"The entered weight is too low. You must enter a weight greater than"},
{"key":"weightModalSetup_2_content","ES":"kilos","EN":"kilos"},
{"key":"weightModalSetup_action","ES":"Por favor, asegúrese de que la cifra es correcta.","EN":"Please make sure the figure is correct."},
{"key":"heightModalSetup_1_content","ES":"La altura introducida es muy baja. Debe introducir una altura mayor de","EN":"The entered height is too low. You must enter a height greater than"},
{"key":"heightModalSetup_2_content","ES":"centímetros","EN":"centimeters"},
{"key":"date_is_not_correct","ES":"Por favor, asegúrese de que la cifra es correcta.","EN":"Please make sure the figure is correct."},
{"key":"systolicModalSetup_High_content","ES":"La tensión sistólica es muy alta para asegurar el riesgo. Debe introducir una tensión diastólica menor de","EN":"Systolic blood pressure is too high to ensure risk. You should enter a diastolic pressure less than"},
{"key":"systolicModalSetup_Low_content","ES":"La tensión sistólica es muy baja para asegurar el riesgo. Debe introducir una tensión diástolica mayor de","EN":"Systolic blood pressure is too low to ensure risk. You must introduce a diastolic pressure greater than"},
{"key":"diastolicModalSetup_High_content","ES":"La tensión diastólica es muy alta para asegurar el riesgo. Debe introducir una tensión diástolica menor de","EN":"Diastolic pressure is too high to ensure risk. You should enter a diastolic pressure less than"},
{"key":"diastolicModalSetup_Low_content","ES":"La tensión diastólica es muy baja para asegurar el riesgo. Debe introducir una tensión diástolica mayor de","EN":"Diastolic pressure is too low to ensure risk. You must introduce a diastolic pressure greater than"},
{"key":"compensatedTensionModal_header","ES":"Tarificación cancelada.","EN":"Canceled pricing."},
{"key":"compensatedTensionModal_content","ES":"La diferencia entre la tensión sistólica y la tensión diástolica es menor de 20 y, por tanto, está muy descompensada.","EN":"The difference between the systolic pressure and the diastolic pressure is less than 20 and, therefore, is highly unbalanced."},
{"key":"compensatedTensionModal_action","ES":"Por favor, asegúrese de que la cifra es correcta para poder realizar la tarificación.","EN":"Please make sure that the figure is correct in order to make the pricing."},
{"key":"modal_header_span","ES":"Atención","EN":"Attention"},
{"key":"modal_body1_span","ES":"Patología","EN":"Pathology"},
{"key":"modal_body2_span","ES":"Patología","EN":"Pathology"},
{"key":"modal_footer_span","ES":" © NacionalRe. Todos los derechos reservados.","EN":" © NacionalRe. All rights reserved."},
{"key":"dateRangeModalSetup_header","ES":"Atención: Fecha fuera de rango","EN":"Attention: Date out of range"},
{"key":"dateRangeModalSetup_content_1","ES":"Por favor, escoga una fecha en el rango (entre ","EN":"Please choose a date in the range (between"},
{"key":"dateRangeModalSetup_content_2","ES":"y","EN":"and"},
{"key":"dateRangeModalSetup_content_3","ES":"años de edad)","EN":"year old)"},
{"key":"dateRangeModalSetup_action_1","ES":"La fecha seleccionada debe estar entre el ","EN":"The selected date must be between"},
{"key":"dateRangeModalSetup_action_2","ES":"y el ","EN":"and the"},
{"key":"birthdayModalSetup_header","ES":"Fecha incorrecta","EN":"Incorrect date"},
{"key":"birthdayModalSetup_content","ES":"La fecha seleccionada no puede ser mayor que la fecha actual.","EN":"The selected date cannot be greater than the current date."},
{"key":"birthdayModalSetup_action","ES":"Por favor, escoga una fecha de nuevo","EN":"Please choose a date again"},
{"key":"warning_attention","ES":"Atención","EN":"Attention"},
{"key":"warning_modal_footer","ES":" © NacionalRe. Todos los derechos reservados.","EN":" © NacionalRe. All rights reserved."},
{"key":"modal_footer_copyright","ES":" © NacionalRe. Todos los derechos reservados.","EN":" © NacionalRe. All rights reserved."}];





export function getDictionaryWord(key) {
    let term = dictionary.filter(d => d.key === key);
    return idiom && term && term[0] && term[0][idiom] ? term[0][idiom] : "Upps sorry";
}

export function setFormDictionary() {

    dictionary.forEach((d) => {
        let term = document.getElementById(d.key);

        if (term) {
            if (term.nodeName === "INPUT" && (term.type === 'reset' || term.type === 'button' || term.type === 'submit')) {
                term.value = getDictionaryWord(d.key);
                return false;
            }
            term.innerHTML = getDictionaryWord(d.key);
            return false;
        }
    })

}