# Life Calculator Edge Cases & Troubleshooting

**Comprehensive guide to boundary conditions, special scenarios, and common issues**

---

## 📑 Table of Contents
1. [Age Boundaries](#age-boundaries)
2. [BMI Edge Cases](#bmi-edge-cases)
3. [Blood Pressure Edge Cases](#blood-pressure-edge-cases)
4. [Cholesterol Edge Cases](#cholesterol-edge-cases)
5. [Alcohol & Tobacco Edge Cases](#alcohol--tobacco-edge-cases)
6. [Special Value Conflicts](#special-value-conflicts)
7. [Rounding Behavior](#rounding-behavior)
8. [Troubleshooting](#troubleshooting)

---

## 🎂 Age Boundaries

### Minimum Age: 13 Years
```typescript
// Edge case: Age = 13 (exactly)
✅ ACCEPTED: 13.0 years
✅ ACCEPTED: 13.5 years
❌ REJECTED: 12.9 years → "Age must be greater than 13"
```

**Actuarial Age**:
- Birth: 01/01/2013
- Today: 01/07/2026 (13.5 years)
- Days to next birthday: ~180 days
- Actuarial age: **14** (if <180 days to birthday)

### Maximum Age: 69 Years
```typescript
// Edge case: Age = 69 (exactly)
✅ ACCEPTED: 69.0 years
✅ ACCEPTED: 69.9 years
❌ REJECTED: 70.0 years → "Age exceeds limit"
```

**Blood Pressure Table**:
- Age ≤ 69: Uses "65-69" row
- Age > 69: **Not supported** (would return -1 in original code)

### Boundary Scenarios
```typescript
// Birth: 15 May 1956, Today: 11 May 2026
Regular age: 69 years, 11 months, 27 days
Actuarial age: 70 (next birthday in 4 days)
Status: ✅ ACCEPTED (regular age used for validation)
```

---

## ⚖️ BMI Edge Cases

### Exact BMI = 28 (Threshold)
```typescript
// BMI = 28.0 exactly
Age ≤ 34: Surcharge = 0% (≤28 is normal range)
Age 35-55: Surcharge = 0%
Age > 55: Surcharge = 0%

// BMI = 28.01
Age ≤ 34: Surcharge = +25% (>28 and ≤30)
```

### Rejection Threshold: BMI > 46
```typescript
// Age ≤ 34
BMI = 46.0: Surcharge = +225%
BMI = 46.1: Code = -1 (REJECT) ← Boundary!

// Age 35-55
BMI = 46.0: Surcharge = +200%
BMI = 46.1: Code = -1 (REJECT)

// Age > 55
BMI = 46.0: Surcharge = +175%
BMI = 46.1: Code = -1 (REJECT)
```

### Deferral: BMI ≤ 16
```typescript
// All ages
BMI = 16.1: Normal or small surcharge
BMI = 16.0: Code = -2 (DEFER) ← Boundary!
BMI = 15.9: Code = -2 (DEFER)
```

### ILT Differences
```typescript
// Life Insurance (age ≤ 34)
BMI = 44: Surcharge = +175%
BMI = 45: Surcharge = +225%

// ILT (age ≤ 34)  
BMI = 44: Code = 999 (REJECT) ← Stricter!
BMI = 45: Code = 999 (REJECT)
```

### Very High BMI
```typescript
// Safety cap in original code
if (imc > 99) imc = 99; // Limited to 99

// Modern implementation: No cap
// BMI can be >99, but table only goes to 46
BMI = 100: Would trigger rejection (>46)
```

---

## 🩺 Blood Pressure Edge Cases

### Exact Boundaries
```typescript
// Systolic = 120, Diastolic = 80 (exactly)
Age = 39 (actuarial)
Result: 0% (normal range: 90-139 systolic, 50-89 diastolic)

// Systolic = 140 (threshold)
Age = 39
Result: 0% (starts at c3 column, but still 0 for age 39)

// Systolic = 161 (threshold)
Age = 39, Diastolic = 89
Result: +45% (c7 column)
```

### Compensation Check
```typescript
// Systolic - Diastolic must be ≥ 20
Systolic = 120, Diastolic = 100
Difference = 20 ✅ ACCEPTED

Systolic = 120, Diastolic = 101  
Difference = 19 ❌ REJECTED → "Uncompensated blood pressure"
```

### Rejection Thresholds
```typescript
// Systolic too low
Systolic = 75: ✅ ACCEPTED
Systolic = 74: ❌ REJECTED → "Systolic pressure too low"

// Systolic too high
Systolic = 200: ✅ ACCEPTED (but likely huge surcharge or -1)
Systolic = 201: ❌ REJECTED → "Systolic pressure too high"

// Diastolic too low
Diastolic = 45: ✅ ACCEPTED
Diastolic = 44: ❌ REJECTED → "Diastolic pressure too low"

// Diastolic too high
Diastolic = 124: ✅ ACCEPTED
Diastolic = 125: ❌ REJECTED → "Diastolic pressure too high"
```

### Table -1 (Reject) Zones
```typescript
// Very high pressure combinations
Systolic = 171+, Diastolic = ≤49
Age = 39
Result: -1 (REJECT) from c9/row combination

// Check matrix for specific reject zones
// Generally: extreme high systolic + low diastolic = reject
```

### Two Blood Pressure Readings
```typescript
// Only one reading provided
Systolic_1 = 130, Diastolic_1 = 85
Systolic_2 = 0, Diastolic_2 = 0
Used: 130/85 (max or only reading)

// Both readings provided
Systolic_1 = 120, Diastolic_1 = 80
Systolic_2 = 130, Diastolic_2 = 90
Used: 125/85 (average)

// Edge: One reading is 0
Systolic_1 = 120, Diastolic_1 = 80
Systolic_2 = 0, Diastolic_2 = 85
Used: 120/85 (max of each)
```

---

## 💊 Cholesterol Edge Cases

### Exact Range Boundaries
```typescript
// Cholesterol = 240 (exactly)
cho0: ≤ 240 → Surcharge = 0%

// Cholesterol = 241 (just over)
cho1: 241-270 → Surcharge varies by age

// Age ≤ 29
Cholesterol = 240: 0%
Cholesterol = 241: +25%
Cholesterol = 270: +25%
Cholesterol = 271: +50% (jumps to cho2)
```

### Age-Dependent Changes
```typescript
// Cholesterol = 250 (cho1 range: 241-270)
Age = 29: +25%
Age = 30: 0% (age 30-49 has cho1 = 0%)
Age = 50: 0% (age 50-59 has cho1 = 0%)
Age = 60: 0% (age >59 has cho1 = 0%)

// Same value, different surcharge!
```

### Maximum Cholesterol
```typescript
// Cholesterol > 450
Age ≤ 29: +200%
Age 30-49: +150%
Age 50-59: +100%
Age > 59: +75%

// No rejection for high cholesterol (only surcharges)
```

---

## 🚬🍷 Alcohol & Tobacco Edge Cases

### Tobacco Units Calculation
```typescript
// Edge: Mixing tobacco types
Cigarettes = 19, Cigars = 0, Pipes = 0
Units = 19 → Surcharge (Life) = 0% (≤19 is normal)

Cigarettes = 20, Cigars = 0, Pipes = 0
Units = 20 → Surcharge (Life) = +25% (20-39 range)

Cigarettes = 0, Cigars = 7, Pipes = 0
Units = 7 × 3 = 21 → Surcharge = +25%

Cigarettes = 10, Cigars = 2, Pipes = 1
Units = 10 + 6 + 2 = 18 → Surcharge = 0%
```

### Tobacco Cap
```typescript
// Original code caps at 99
Cigarettes = 100, Cigars = 0, Pipes = 0
Units = 99 (capped) → Surcharge = +50%

// Modern: No cap, but table ends at "40+"
Units = 100 → Uses ">40" row = +50%
```

### Tobacco ILT vs Life
```typescript
// Units = 20
Life: 0% (≤19 is normal, but 20-39 is +25%)
ILT: +25% (>15 and ≤25)

// Different thresholds!
```

### Alcohol Units Calculation
```typescript
// Gender matters!
Wines = 4, Beers = 0, Spirits = 0

Male:
  Units = 4 → Surcharge (Life) = 0% (≤4 is normal)
  
Female:
  Units = 4 → Surcharge (Life) = +100% (>4)
  
// Same consumption, different result!
```

### Alcohol Age Discount (>45 years)
```typescript
// Male, 6 wines
Units = 6
Base surcharge = +100%

Age = 44 (actuarial): +100%
Age = 45 (actuarial): +100%  
Age = 46 (actuarial): +75% (-25 discount) ← Boundary!

// Only applies to Life/Disability/Accident/Serious Illness
// NOT for ILT
```

### Alcohol Rejection in Disability/Accident
```typescript
// Alcohol surcharge = 75% (exactly)
Disability: 75% ✅ ACCEPTED

// Alcohol surcharge = 76%
Disability: -1 (REJECT) ← Boundary!

// Life/Serious Illness: No rejection for alcohol
```

---

## ⚠️ Special Value Conflicts

### Multiple Special Values
```typescript
// Scenario 1: IMC = -2 (defer), Blood Pressure = -1 (reject)
const specialValue = [-2, -1].find(s => s === -1 || s === -2);
// Returns: -2 (first found)
// Result: DEFER (not reject)

// Implementation: Use find() which returns first match
// Recommendation: Check all values, prioritize -1 over -2
```

**Correct Priority**:
```typescript
// Priority: Reject (-1) > Defer (-2)
if (surcharges.includes(-1)) return -100;
if (surcharges.includes(-2)) return -200;
```

### Special Values in Formulas
```typescript
// IMC = -1 (reject)
// Should calculation continue?

// WRONG: Adding special values
total = (-1) + tension + tobacco // = negative total

// CORRECT: Check first, return early
if (imc === -1) return -100;
```

### ILT 999 vs Life -1
```typescript
// BMI = 45, Age = 30

Life Insurance:
  IMC = +150% ✅ Accepted
  
ILT:
  IMC_ILT = 999 ❌ Rejected
  
// Different tables, different results!
```

---

## 🔢 Rounding Behavior

### Rounding Formula
```typescript
result = Math.round(value × factorAdjustment) × 25
```

### Examples
```typescript
// Case 1: Clean rounding
value = 100, factorAdjustment = 0.04
result = Math.round(100 × 0.04) × 25
       = Math.round(4) × 25
       = 4 × 25 = 100

// Case 2: Rounds up
value = 112.5, factorAdjustment = 0.04
result = Math.round(112.5 × 0.04) × 25
       = Math.round(4.5) × 25
       = 5 × 25 = 125

// Case 3: Rounds down
value = 87.4, factorAdjustment = 0.04
result = Math.round(87.4 × 0.04) × 25
       = Math.round(3.496) × 25
       = 3 × 25 = 75
```

### Rounding Precision
```typescript
// Original: Basis points × 100, then round, then × 25
// This ensures results are always multiples of 25

Possible results: 0, 25, 50, 75, 100, 125, 150, 175, 200, 225, ...
Impossible: 10, 15, 33, 67, 99, 101, etc.
```

### Floating Point Edge Cases
```typescript
// JavaScript floating point quirks
0.1 + 0.2 = 0.30000000000000004

// Life calculator uses:
Math.round() // Handles floating point safely
× 25 // Further rounds to 25-point increments
```

---

## 🐛 Troubleshooting

### Issue: "Calculation returns empty array"
**Possible Causes**:
1. ✅ **Validation failed** - Check console for validation errors
2. ✅ **Life exceeds inMax** - Modal should show, all insurances rejected
3. ✅ **Special value (-1, -2)** - Check individual surcharges

**Debug**:
```typescript
console.log('Validation:', this.validateLifeFields(lifeFields));
console.log('Partial Surcharges:', lifePartialSurcharges);
console.log('lifeFactor:', lifeFactor);
console.log('Total Surcharges:', lifeTotalSurcharges);
console.log('inMax:', lifeInMax);
```

---

### Issue: "Accident surcharge is half of Life"
**Diagnosis**: ✅ **This is CORRECT!**
- Accident formula divides IMC by 2
- This is intentional actuarial logic

**Verification**:
```typescript
// If Life IMC = 25%, Accident IMC should = 12.5%
```

---

### Issue: "Cholesterol surcharge changes when age crosses 30"
**Diagnosis**: ✅ **This is CORRECT!**
- Age-dependent tables
- Same cholesterol, different age = different surcharge

**Example**:
```typescript
// Cholesterol 250 (cho1 range)
Age 29: +25%
Age 30: 0% (age bracket change)
```

---

### Issue: "Blood pressure returns -1 unexpectedly"
**Possible Causes**:
1. ✅ **Very high systolic + low diastolic** - Check BP matrix
2. ✅ **Age out of range** - Verify actuarial age ≤ 69
3. ✅ **Diastolic out of table range** - Check ≤ 124

**Debug**:
```typescript
console.log('Actuarial Age:', actuarialAge);
console.log('Systolic:', systolic, 'Diastolic:', diastolic);
console.log('Age Group:', this.getAgeGroup(actuarialAge));
console.log('Diastolic Group:', this.getDiastolicGroup(diastolic));
console.log('Systolic Column:', this.getSystolicColumn(systolic));
```

---

### Issue: "lifeFactor is wrong"
**Check**: Each factor must be >0 to count as 1

**Debug**:
```typescript
console.log('IMC:', lifeSurcharges.imc.FALLECIMIENTO, '→', lifeSurcharges.imc.FALLECIMIENTO > 0 ? 1 : 0);
console.log('Tobacco:', lifeSurcharges.tobacco.FALLECIMIENTO, '→', lifeSurcharges.tobacco.FALLECIMIENTO > 0 ? 1 : 0);
console.log('Alcohol:', lifeSurcharges.alcohol.FALLECIMIENTO, '→', lifeSurcharges.alcohol.FALLECIMIENTO > 0 ? 1 : 0);
console.log('Cholesterol:', lifeSurcharges.cholesterol, '→', lifeSurcharges.cholesterol > 0 ? 1 : 0);
console.log('Blood Pressure:', lifeSurcharges.bloodPressure, '→', lifeSurcharges.bloodPressure > 0 ? 1 : 0);
console.log('Total lifeFactor:', lifeFactor.life);
```

---

### Issue: "Disability/Accident shows -100% (reject)"
**Diagnosis**: Alcohol surcharge > 75
- Check: `alcohol.FALLECIMIENTO > 75`
- This triggers automatic rejection for these insurance types

**Solution**: Either:
1. Accept rejection (correct behavior)
2. Reduce alcohol consumption input

---

### Issue: "ILT differs from Life insurance"
**Diagnosis**: ✅ **This is CORRECT!**
- ILT uses separate tables
- Different thresholds and surcharges

**Verification**:
```typescript
// Check you're using correct values
IMC: imc.ILT (not imc.FALLECIMIENTO)
Tobacco: tobacco.ILT (not tobacco.FALLECIMIENTO)
Alcohol: alcohol.ILT (not alcohol.FALLECIMIENTO)
```

---

### Issue: "Modal doesn't show for rejection"
**Check**:
1. ✅ Modal callback provided: `openModalWindow` function
2. ✅ Special value detected: Look for -1, -2, or 999
3. ✅ Life > inMax check

**Debug**:
```typescript
// Ensure callback is provided
calculateLifeInsurances(
  lifeFields,
  healthForm,
  (message, id) => console.log('Modal:', message), // ← Check this
  applicantId
);
```

---

### Issue: "Results are not multiples of 25"
**Diagnosis**: ❌ **Something is wrong!**
- All results should be multiples of 25
- Check if rounding formula is correct

**Verification**:
```typescript
// Should always be true
result % 25 === 0
```

---

## 🧪 Testing Edge Cases

### Test Suite Template
```typescript
describe('Life Calculator Edge Cases', () => {
  it('should accept age 13 exactly', () => {
    // birthDate results in age = 13.0
    expect(result).not.toEqual([]);
  });
  
  it('should reject age 12.99', () => {
    // birthDate results in age = 12.99
    expect(validationFailed).toBe(true);
  });
  
  it('should defer BMI ≤ 16', () => {
    // BMI = 16.0
    expect(result.FALLECIMIENTO).toBe(-200);
  });
  
  it('should reject BMI > 46', () => {
    // BMI = 46.1
    expect(result.FALLECIMIENTO).toBe(-100);
  });
  
  it('should halve IMC for accidents', () => {
    // IMC surcharge = 25%
    expect(accidentIMC).toBe(12.5);
  });
  
  it('should apply alcohol discount for age > 45', () => {
    // 6 wines, male, age 46
    expect(alcoholSurcharge).toBe(75); // 100 - 25
  });
  
  it('should reject disability if alcohol > 75', () => {
    // Alcohol = 100
    expect(disability).toBe(-100);
  });
});
```

---

## 📚 Related Documentation

- **Quick Reference**: `LIFE_CALCULATOR_QUICK_REFERENCE.md` - Fast lookup
- **Full README**: `docs/vidaNr/.../README.md` - Comprehensive guide
- **Implementation**: `docs/readme/healthFormLife.md` - TypeScript details

---

**Last Updated**: May 2026  
**Maintained By**: Development Team  
**Original Source**: VidaNr (2022) / FoxPro DaVinci30
