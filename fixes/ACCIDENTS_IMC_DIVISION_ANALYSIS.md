# Accidents IMC Division & Cumulus Calculation Analysis

**Date:** May 7, 2026  
**Component:** Results Display (modal_results.js)  
**Status:** Clarification - No Bug (Original Implementation Correct)

## Summary

Analysis of the Accidents column IMC display and cumulus calculation revealed that the original `/2` division was intentional and correct. The display shows **effective contribution** to the total, not raw table values.

## Background

The user reported that the Accidents column showed IMC = 12.5% instead of the expected 25% from the IMC tables. Initial analysis incorrectly concluded this was a bug. Further testing revealed the original implementation was correct.

## The Accidents Formula (Original FoxPro)

```foxpro
lnTAcci = ROUND(((lnIMC/2) + lnTension + lnFuma + IIF(lnBebe<=75, lnBebe, 999) + lnColes) * (1.1^(nagra-1)) / 25, 0) * 25
```

**Key Point:** IMC is weighted at **50% (divided by 2)** in the Accidents insurance calculation.

## Display Logic (Correct Implementation)

The results table displays the **effective contribution** of each component to match the formula:

### For All Insurance Types EXCEPT Accidents:
```javascript
IMC Display = IMC Table Value (e.g., 25%)
```

### For Accidents Insurance:
```javascript
IMC Display = IMC Table Value / 2 (e.g., 25% / 2 = 12.5%)
```

## Cumulus Calculation

Cumulus represents the difference between the calculated total and the sum of displayed components:

```javascript
Cumulus = Total Insurance - (IMC_display + Tension + Tobacco + Alcohol + Cholesterol)
```

**Critical:** For cumulus to be accurate, displayed values must match their contribution to the formula.

### In modal_results.js:

```javascript
function getSurcharge(data, insurance, key) {
    let sum = 0;
    
    if (key === 'accident') {
        // IMC weighted at 50% for accidents
        sum = data.alcohol[key] + data.cholesterol + data.imc[key] / 2 + data.tension + data.tobacco[key];
    } else {
        sum = data.alcohol[key] + data.cholesterol + data.imc[key] + data.tension + data.tobacco[key];
    }
    
    // Cumulus = insurance total - sum of components
    return (insurance[key] - sum) + '%';
}
```

## Example Calculations

### Test Case 1: Female, Age 36, IMC 32.65
**IMC Table Lookup:** 25% surcharge  
**Inputs:**
- IMC table value: 25%
- Cholesterol: 25%
- All others: 0%
- nagra (risk factors > 0): 2

**Life Insurance:**
```
Sum = 25 + 25 + 0 + 0 + 0 = 50%
Total = ROUND(50 * 1.1^1 / 25, 0) * 25 = ROUND(2.2, 0) * 25 = 50%
Display: IMC = 25%, Cumulus = 50 - 50 = 0% ✓
```

**Accidents Insurance:**
```
Sum = (25/2) + 25 + 0 + 0 + 0 = 12.5 + 25 = 37.5%
Total = ROUND(37.5 * 1.1^1 / 25, 0) * 25 = ROUND(1.65, 0) * 25 = 50%
Display: IMC = 12.5%, Cumulus = 50 - 37.5 = 12.5% ✓
```

### Test Case 2: Male, Age 18, IMC 17.30 (underweight)
**IMC Table Lookup:** 50% surcharge  
**Inputs:**
- IMC table value: 50%
- All others: 0%
- nagra: 1

**Life Insurance:**
```
Sum = 50 + 0 + 0 + 0 + 0 = 50%
Total = ROUND(50 * 1.1^0 / 25, 0) * 25 = ROUND(2.0, 0) * 25 = 50%
Display: IMC = 50%, Cumulus = 50 - 50 = 0% ✓
```

**Accidents Insurance:**
```
Sum = (50/2) + 0 + 0 + 0 + 0 = 25%
Total = ROUND(25 * 1.1^0 / 25, 0) * 25 = ROUND(1.0, 0) * 25 = 25%
Display: IMC = 25%, Cumulus = 25 - 25 = 0% ✓
```

## What Was Initially "Fixed" (Incorrectly)

**WRONG Approach:** Display raw table values without /2 division
```javascript
// This breaks cumulus calculation for Accidents!
IMC Display (Accidents) = 50%  // Raw table value
Total (from formula) = 25%     // Uses IMC/2
Cumulus = 25 - 50 = -25% ❌    // Nonsensical negative value
```

## Correct Implementation (Original)

**RIGHT Approach:** Display effective contribution
```javascript
IMC Display (Accidents) = 50% / 2 = 25%  // Effective contribution
Total (from formula) = 25%                // Uses IMC/2
Cumulus = 25 - 25 = 0% ✓                 // Correct!
```

## Implementation Checklist for Other Platforms

When implementing this logic on another platform, ensure:

- [ ] **IMC Table Lookup:** Returns the base surcharge value (e.g., 25%, 50%)
- [ ] **Accidents Display:** Divide IMC by 2 when displaying in Accidents column
- [ ] **Accidents Formula:** Divide IMC by 2 in the total calculation formula
- [ ] **Cumulus Sum:** Divide IMC by 2 when summing components for Accidents
- [ ] **Other Insurance Types:** Use full IMC value (no division)
- [ ] **Test:** Verify cumulus = 0 for simple cases with only IMC surcharge

## Code Reference

### Display Logic (getTableResult function)
```javascript
if (key === 'accident') {
    table += '<td>'+ getDictionaryWord('imc_initials')+ '</td>';
    table += ' <td>' + getPartialResult(data.imc[key] / 2) + '</td>';
} else {
    table += '<td>'+ getDictionaryWord('imc_initials')+ '</td>';
    table += ' <td>' + getPartialResult(data.imc[key]) + '</td>';
}
```

### Cumulus Calculation (getSurcharge function)
```javascript
if (key === 'accident') {
    sum = data.alcohol[key] + data.cholesterol + data.imc[key] / 2 + data.tension + data.tobacco[key];
} else {
    sum = data.alcohol[key] + data.cholesterol + data.imc[key] + data.tension + data.tobacco[key];
}
```

### Insurance Formula (calcAccident function in insurance_calc.js)
```javascript
function calcAccident(result, factor) {
    return Math.round(((result.imc.life / 2) + result.tension + result.tobacco.life + 
           (result.alcohol.life <= 75 ? result.alcohol.life : 999) + result.cholesterol) * 
           ((Math.pow(1.1, (factor.life - 1))) / 25)) * 25;
}
```

## Conclusion

The `/2` division for IMC in Accidents insurance is **intentional and correct**. It appears in three places:
1. Display of IMC value
2. Cumulus calculation (sum of components)
3. Insurance formula (total calculation)

This ensures consistency between displayed components, their sum, and the calculated total. The cumulus then accurately represents the compounding penalty from having multiple risk factors.

**No bug exists in the original implementation.**

## Files Involved

- `src/scripts/modal_results.js` - Display and cumulus calculation
- `src/scripts/insurance_calc.js` - Insurance formula calculations
- `src/scripts/imc_calc.js` - IMC table lookups

## References

- Original FoxPro code: `fixes/Código orig VidaNR en Davinci30.rtf`
- Actuarial age fix: `fixes/ACTUARIAL_AGE_CALCULATION_FIX.md`
