
var version = "1.0.0";

export function toDateString(date, lang, dateOptions) {

  let l = lang && lang === 'FR' ? "fr-FR" : lang && lang === 'EN' ? "en-UK" : "es-ES";
  ;
  return lang && lang === 'EN' ? date.toDateString(l, dateOptions) : date.toLocaleDateString(l, dateOptions);
}

export function addEventListenerList(nodelist, event, fn) {
  let e = event || window.event;
  for (var i = 0, len = nodelist.length; i < len; i++) {
    nodelist[i].addEventListener(e, fn, false);
  }
}



export function dateIsHigher(birthDate) {
  if (Date.now() - birthDate.getTime() < 0) {
    return true;
  }
  return false;
}

export function subtractYearsToDate(date, years) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

export function dateIsOnRange(range, check) {
  var dateMin = subtractYearsToDate(new Date(), range[0]);
  var dateMax = subtractYearsToDate(new Date(), range[1]);

  if (check > dateMax && check < dateMin) {
    return true;
  }
  return false;
}

function calculate_days(from, to) {
  if (from.getTime() > to.getTime()) {
    to.setFullYear(to.getFullYear() + 1);
  }
  let diff = to.getTime() - from.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
export function calculate_age(birthDate) {
  if (!(birthDate instanceof Date) || isNaN(birthDate.getTime())) {
    throw new Error("Invalid date format. Expected a valid JavaScript Date object.");
  }

  const today = new Date();

  // Compute regular age
  let regularAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    regularAge--;
  }

  // Calculate next birthday
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate days to next and from past birthday
  const daysToNextBirthday = calculate_days_simple(today, nextBirthday);
  const pastBirthday = new Date(today.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());
  const daysFromPastBirthday = calculate_days_simple(pastBirthday, today);

  // Actuarial age calculation: if closer to next birthday, increase age
  const actuarialAge = daysToNextBirthday < daysFromPastBirthday ? regularAge + 1 : regularAge;

  return { regular: regularAge, actuarial: actuarialAge };
}

// Helper function to calculate the number of days between two dates
function calculate_days_simple(date1, date2) {
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}


export function isNumberKey(evt) {
  let e = evt || window.event;
  let y = e.currentTarget.value;
  var charCode = (e.charCode) ? e.charCode : ((e.keyCode) ? e.keyCode :
    ((e.which) ? e.which : 0));
  // allow decimals
  if (charCode > 31 && ((charCode != 46 || charCode != 44) && (charCode < 48 || charCode > 57))) {
    e.preventDefault();
    return false;
  }
  return true;
}

export function limitChars(evt) {
  let e = evt || window.event;
  let y = e.currentTarget.value;
  var max_chars = 2;

  if (y.length > max_chars) {
    e.currentTarget.value = y.substr(0, max_chars);
  }
  return false;
}


export function cmToMeter(cm) {
  return Number(cm) / 100;
}


