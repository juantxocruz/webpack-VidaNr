import { getDictionaryWord, setFormDictionary } from './dictionary';
import { modalSetup, openModalWindow, initModalWindow } from './modal_window';

function isBlank(str) {
    return (!!!str || /^\s*$/.test(str));
}

function isATake(sys, dia) {
    if (isBlank(sys) || isBlank(dia)) {
        return false;
    }
    return true;
}
function setNumber(input) {
    return input && input !== '' ? parseInt(input) : 0;
}


export function hypertensionFieldsOn(fields) {
    let firstOn = false;
    let secondOn = false;

    if (!isBlank(fields[0].value) && !isBlank(fields[1].value)) {
        firstOn = true
    }
    if (!isBlank(fields[2].value) && !isBlank(fields[3].value)) {
        secondOn = true
    }
    if (firstOn || secondOn) {
        return true;
    }
    return false;
}

export function hypertensionMsgOff() {
    let blocked = [];
    let msgs = [...document.querySelectorAll(`[data-type*="tension-msg"]`)];

    msgs.forEach((msg) => {
        if (msg.style.display === 'block') {
            blocked.push(msg);
        }
    });

    return blocked.length > 0 ? false : true;

}

export function isCompensatedTension() {
    let $phrase = document.getElementById("hypertension_msg");
    // WARNING ABOUT LANG, IDIOM, ADD language term here!!
    if ($phrase.innerHTML === 'Compensada' || $phrase.innerHTML === 'Compensated' || $phrase.innerHTML === 'Compensés') {

        return true;
    }
    return false;
}



export function setHypertensionResume(hypertension, $systolic, $diastolic) {
    $diastolic.value = hypertension.diastolic !== 0 ? hypertension.diastolic : '';
    $systolic.value = hypertension.systolic !== 0 ? hypertension.systolic : '';
    let x;
}
export function setHypertensionPhrase(hypertension_mean) {
    let $phrase = document.getElementById("hypertension_msg");
    $phrase.classList.remove("blue", "green", "red");
    $phrase.innerHTML = '';

    if (hypertension_mean.systolic > 0 && hypertension_mean.diastolic > 0) {

        if ((hypertension_mean.systolic - hypertension_mean.diastolic) >= 20) {
            $phrase.innerHTML = getDictionaryWord('compensated_upper');
            $phrase.classList.add("green");
        }
        else {
            $phrase.innerHTML = getDictionaryWord('unbalanced_upper');
            $phrase.classList.add("red");
            modalSetup.header = getDictionaryWord("compensatedTensionModal_header");
            modalSetup.content = getDictionaryWord("compensatedTensionModal_content");
            modalSetup.action = getDictionaryWord("compensatedTensionModal_action");
            modalSetup.footer = getDictionaryWord("modal_footer_info");

            openModalWindow(null, modalSetup);
        }
    } else {
        $phrase.innerHTML = ''
    }
    return false;
}


export function getHypertensionMean(systolic_1, diastolic_1, systolic_2, diastolic_2) {

    let hypertesion = {
        systolic: 0,
        diastolic: 0
    }
    systolic_1 = setNumber(systolic_1);
    diastolic_1 = setNumber(diastolic_1);
    systolic_2 = setNumber(systolic_2);
    diastolic_2 = setNumber(diastolic_2);

    if (systolic_1 > 0 && systolic_2 > 0) {
        hypertesion.systolic = (systolic_1 + systolic_2) / 2
    } else {
        hypertesion.systolic = systolic_1 + systolic_2
    }
    if (diastolic_1 > 0 && diastolic_2 > 0) {
        hypertesion.diastolic = (diastolic_1 + diastolic_2) / 2
    } else {
        hypertesion.diastolic = diastolic_1 + diastolic_2
    }

    return hypertesion;
}



export function setSystolicColors(input, systolic) {

    input.classList.remove("blue", "green", "red");
    if (systolic > 145 || systolic < 65) {
        input.classList.add("red");
        return false;
    }

    if (systolic > 131) {
        input.classList.add("blue");
        return false;
    }

    input.classList.add("green");
    return false;

}

export function setDiastolicColors(input, diastolic) {
    input.classList.remove("blue", "green", "red");
    if (diastolic > 95 || diastolic < 45) {
        input.classList.add("red");
        return false;
    }
    if (diastolic > 80) {
        input.classList.add("blue");
        return false;
    }
    input.classList.add("green");
    return false;

}


