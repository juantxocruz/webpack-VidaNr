
let tension_matrix = [
    { "key": "systolic", "age": 0, "diastolic": 0, "c1": 1, "c2": 90, "c3": 141, "c4": 146, "c5": 151, "c6": 156, "c7": 161, "c8": 166, "c9": 171 },
    { "key": "row", "age": 39, "diastolic": 49, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 89, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 10, "c6": 25, "c7": 45, "c8": 60, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 94, "c1": -1, "c2": 0, "c3": 10, "c4": 20, "c5": 30, "c6": 45, "c7": 65, "c8": 85, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 99, "c1": -1, "c2": 25, "c3": 30, "c4": 40, "c5": 50, "c6": 60, "c7": 80, "c8": 100, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 104, "c1": -1, "c2": 55, "c3": 60, "c4": 65, "c5": 75, "c6": 85, "c7": 100, "c8": 115, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 109, "c1": -1, "c2": -1, "c3": -1, "c4": 105, "c5": 110, "c6": 120, "c7": 130, "c8": 145, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 114, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": 170, "c6": 175, "c7": 180, "c8": 195, "c9": -1 },
    { "key": "row", "age": 39, "diastolic": 124, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 49, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 89, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 20, "c8": 40, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 94, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 10, "c6": 20, "c7": 35, "c8": 50, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 99, "c1": -1, "c2": 0, "c3": 10, "c4": 15, "c5": 25, "c6": 35, "c7": 45, "c8": 60, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 104, "c1": -1, "c2": 40, "c3": 40, "c4": 45, "c5": 50, "c6": 60, "c7": 70, "c8": 85, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 109, "c1": -1, "c2": -1, "c3": -1, "c4": 90, "c5": 95, "c6": 100, "c7": 105, "c8": 115, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 114, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": 145, "c6": 145, "c7": 150, "c8": 160, "c9": -1 },
    { "key": "row", "age": 49, "diastolic": 124, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 49, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 89, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 20, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 94, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 15, "c8": 30, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 99, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 15, "c7": 25, "c8": 40, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 104, "c1": -1, "c2": 20, "c3": 25, "c4": 30, "c5": 35, "c6": 40, "c7": 50, "c8": 60, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 109, "c1": -1, "c2": -1, "c3": -1, "c4": 80, "c5": 85, "c6": 90, "c7": 95, "c8": 100, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 114, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": 135, "c6": 135, "c7": 135, "c8": 135, "c9": -1 },
    { "key": "row", "age": 59, "diastolic": 124, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 49, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 89, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 94, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 15, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 99, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 15, "c8": 25, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 104, "c1": -1, "c2": 10, "c3": 15, "c4": 20, "c5": 25, "c6": 30, "c7": 35, "c8": 40, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 109, "c1": -1, "c2": -1, "c3": -1, "c4": 60, "c5": 60, "c6": 60, "c7": 60, "c8": 60, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 114, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": 100, "c6": 100, "c7": 100, "c8": 110, "c9": -1 },
    { "key": "row", "age": 64, "diastolic": 124, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 49, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 89, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 94, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 0, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 99, "c1": -1, "c2": 0, "c3": 0, "c4": 0, "c5": 0, "c6": 0, "c7": 0, "c8": 15, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 104, "c1": -1, "c2": 0, "c3": 0, "c4": 10, "c5": 15, "c6": 15, "c7": 20, "c8": 25, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 109, "c1": -1, "c2": -1, "c3": -1, "c4": 35, "c5": 35, "c6": 35, "c7": 35, "c8": 35, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 114, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": 55, "c6": 55, "c7": 60, "c8": 65, "c9": -1 },
    { "key": "row", "age": 69, "diastolic": 124, "c1": -1, "c2": -1, "c3": -1, "c4": -1, "c5": -1, "c6": -1, "c7": -1, "c8": -1, "c9": -1 }];



function getAgeGroup(age) {

    if (age <= 39) {
        return 39;
    }
    if (age > 39 && age <= 49) {
        return 49;
    }
    if (age > 49 && age <= 59) {
        return 59;
    }
    if (age > 59 && age <= 64) {
        return 64;
    }
    if (age > 64 && age <= 69) {
        return 69;
    }
    if (age > 69) {
        return -1
    }
}

function getDiastolicGroup(diasto) {

    if (diasto <= 49) {
        return 49;
    }
    if (diasto > 49 && diasto <= 89) {
        return 89;
    }
    if (diasto > 89 && diasto <= 94) {
        return 94;
    }
    if (diasto > 94 && diasto <= 99) {
        return 99;
    }
    if (diasto > 99 && diasto <= 104) {
        return 104;
    }
    if (diasto > 104 && diasto <= 109) {
        return 109;
    }
    if (diasto > 109 && diasto <= 114) {
        return 114;
    }
    if (diasto > 114 && diasto <= 124) {
        return 124;
    }
    if (diasto > 124) {
        return -1;
    }
}

function getSystolicGroup(systo) {
    if (systo < 90) {
        return 'c1';
    }
    if (systo >= 90 && systo < 140) {
        return 'c2';
    }
    if (systo >= 140 && systo < 146) {
        return 'c3';
    }
    if (systo >= 146 && systo < 150) {
        return 'c4';
    }
    if (systo >= 150 && systo < 156) {
        return 'c5';
    }
    if (systo >= 156 && systo < 161) {
        return 'c6';
    }
    if (systo >= 161 && systo < 166) {
        return 'c7';
    }
    if (systo >= 166 && systo < 171) {
        return 'c8';
    }
    if (systo >= 171) {
        return 'c9';
    }

}

// get the row for age and diastolic mean
function getDiastolicRow(age, diastolic) {

    let ageGroup = getAgeGroup(age);
    let diastolicGroup = getDiastolicGroup(diastolic);

    let diastolicRow = tension_matrix.filter((d) => {
        return d.age === ageGroup && d.diastolic === diastolicGroup;
    })
    return diastolicRow;
}

function getSystolicRow(systolic) {
    let systolicGroup = getSystolicGroup(systolic);
    return systolicGroup;

}

export function calcTension(_age, _hypertension_mean) {

    let diastolicRow = getDiastolicRow(_age.actuarial, _hypertension_mean.diastolic)[0];
    let systolicRow = getSystolicRow(_hypertension_mean.systolic);
    let tension = diastolicRow[systolicRow];
    return tension;


}

