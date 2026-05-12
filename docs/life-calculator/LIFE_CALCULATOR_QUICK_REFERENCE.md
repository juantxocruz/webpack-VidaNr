# Life Calculator Quick Reference Guide

**Quick access guide for developers working with the VidaNr Life Insurance Calculator**

---

## 🚀 Quick Start

### Calculation Flow
```
Input Fields → Partial Surcharges → lifeFactor → Final Insurances → inMax Check → Results
```

### Required Inputs
- **Age**: 13-69 years (actuarial age used)
- **Gender**: Male/Female
- **BMI**: Weight(kg) / Height(m)²
- **Tobacco**: Cigarettes + Cigars×3 + Pipes×2
- **Alcohol**: Wines + Beers + Spirits×2
- **Blood Pressure**: Systolic (75-200), Diastolic (45-124)
- **Cholesterol**: Range selection (≤240 to >450)

---

## 📊 Special Formula Rules

### ⚠️ **Accidents (Accidentes) - IMC is HALVED**
```typescript
// Other insurances
totalSurcharges = imc + tension + tobacco + alcohol + cholesterol

// ACCIDENTS (different!)
totalSurcharges = (imc / 2) + tension + tobacco + alcohol + cholesterol
//                 ^^^^^^^^ Note: IMC divided by 2
```

### ⚠️ **Alcohol Threshold for Disability/Accident**
```typescript
// If alcohol surcharge > 75, becomes REJECT (-1)
alcoholSurcharge = alcohol.FALLECIMIENTO <= 75 
  ? alcohol.FALLECIMIENTO 
  : -1; // Reject
```

### ⚠️ **Tobacco Multiplier for Serious Illness**
```typescript
// Serious Illness uses 1.5× tobacco surcharge
totalSurcharges = imc + tension + (tobacco × 1.5) + alcohol + cholesterol
//                                 ^^^^^^^^^^^^^^
```

### ⚠️ **Different Tables for ILT**
```typescript
// ILT uses separate lookup tables
imc.ILT        // Not imc.FALLECIMIENTO
tobacco.ILT    // Not tobacco.FALLECIMIENTO
alcohol.ILT    // Not alcohol.FALLECIMIENTO
```

---

## 🔢 Special Values

| Code | Meaning | Context | Action |
|------|---------|---------|--------|
| **-1** | Rechazar (Reject) | BMI, Blood Pressure | Stop, show reject modal |
| **-2** | Aplazar (Defer) | BMI | Stop, show defer modal |
| **999** | Rechazar (for ILT) | Alcohol, ILT tables | Reject this insurance type |
| **0** | Normal | No surcharge | Continue |

### Handling Special Values
```typescript
// Check for special values first
const specialValue = surcharges.find(s => s === -1 || s === -2);
if (specialValue !== undefined) {
  return specialValue * 100; // Return -100 or -200
}
```

---

## 🧮 lifeFactor (NAGRA) Calculation

### Formula
```typescript
lifeFactor = (imc > 0 ? 1 : 0) + 
             (tobacco > 0 ? 1 : 0) + 
             (alcohol > 0 ? 1 : 0) + 
             (cholesterol > 0 ? 1 : 0) + 
             (bloodPressure > 0 ? 1 : 0);
// Result: 0-5 (number of risk factors)
```

### Multipliers by lifeFactor
| lifeFactor | Multiplier | Calculation |
|------------|------------|-------------|
| 0 | 1.0 | No risk factors |
| 1 | 1.0 | 1.1^(1-1) = 1.1^0 = 1.0 |
| 2 | 1.1 | 1.1^(2-1) = 1.1^1 = 1.1 |
| 3 | 1.21 | 1.1^(3-1) = 1.1^2 = 1.21 |
| 4 | 1.331 | 1.1^(4-1) = 1.1^3 = 1.331 |
| 5 | 1.464 | 1.1^(5-1) = 1.1^4 = 1.464 |

**Note**: Serious Illness uses 1.2 instead of 1.1

---

## 💰 Final Insurance Formulas

### Life (Fallecimiento)
```typescript
result = Math.round((imc + tension + tobacco + alcohol + cholesterol) 
         × 100 × (1.1^(lifeFactor-1) / 25)) × 25
```

### Disability (Invalidez)
```typescript
alcoholAdj = alcohol <= 75 ? alcohol : -1; // Reject if >75
result = Math.round((imc + tension + tobacco + alcoholAdj + cholesterol) 
         × 100 × (1.1^(lifeFactor-1) / 25)) × 25
```

### Accident (Accidentes)
```typescript
alcoholAdj = alcohol <= 75 ? alcohol : -1;
result = Math.round(((imc/2) + tension + tobacco + alcoholAdj + cholesterol) 
         × 100 × (1.1^(lifeFactor-1) / 25)) × 25
//                  ^^^^^ IMC HALVED!
```

### Serious Illness (Enfermedad Grave)
```typescript
result = Math.round((imc + tension + (tobacco×1.5) + alcohol + cholesterol) 
         × 100 × (1.2^(lifeFactor-1) / 25)) × 25
//                  ^^^^^^^^^^^^^^           ^^^^ Uses 1.2 instead of 1.1
```

### ILT (Temporary Disability)
```typescript
result = Math.round((imc_ILT + tension + tobacco_ILT + alcohol_ILT + cholesterol) 
         × 100 × (1.1^(lifeFactor-1) / 25)) × 25
//               ^^^^^^^^         ^^^^^^^^^^^  ^^^^^^^^^^^^ Separate tables!
```

---

## 🚫 Rejection Logic (inMax)

### Calculate inMax
```typescript
inMax = lifeFactor < 2 ? 200 : 300
```

### Check Life Insurance
```typescript
if (lifeInsuranceSurcharge > inMax) {
  // REJECT ALL insurances
  showModal('Life exceeds maximum allowed');
  return []; // Abort all calculations
}
```

**Important**: If Life is rejected, ALL other insurances are also rejected.

---

## 📐 Actuarial Age vs Regular Age

### When to Use Each
- **Regular Age**: Most calculations (BMI, Tobacco, Alcohol for Life)
- **Actuarial Age**: Blood Pressure, Cholesterol, IMC, Alcohol (for some calculations)

### Calculate Actuarial Age
```typescript
// If <6 months (180 days) to next birthday → age + 1
const nextBirthday = getNextBirthday(birthDate);
const daysToNextBirthday = daysBetween(today, nextBirthday);
const actuarialAge = daysToNextBirthday < 180 ? regularAge + 1 : regularAge;
```

### Example
- Birth: 16 Dec 1991
- Today: 31 Aug 2022
- Regular age: 30 years, 8 months
- Next birthday: 16 Dec 2022 (107 days away)
- Actuarial age: **31** (less than 180 days away)

---

## 🩺 Blood Pressure Matrix

### 3-Dimensional Lookup
1. **Age Range** (actuarial): ≤39, 40-49, 50-59, 60-64, 65-69
2. **Diastolic Range**: ≤49, 50-89, 90-94, 95-99, 100-104, 105-109, 110-114, 115-124
3. **Systolic Range**: <90, 90-139, 140-145, 146-149, 150-155, 156-160, 161-165, 166-170, ≥171

### Example
- Age: 39 (actuarial)
- Systolic: 161
- Diastolic: 89
- **Result**: 45% surcharge (from c7 column)

---

## ⚡ Common Scenarios

### Scenario 1: Only BMI is high (29.38)
```
IMC: +25%
lifeFactor: 1 (only BMI > 0)
Multiplier: 1.0

Results:
- Life: +25%
- Disability: +25%
- Accident: +12.5% (IMC halved!)
- Serious Illness: +25%
- ILT: +25%
```

### Scenario 2: BMI + High Cholesterol
```
IMC: +25%
Cholesterol: +50%
lifeFactor: 2 (two factors)
Multiplier: 1.1

Results:
- Life: (25+50) × 1.1 = 82.5% → rounds to 75% or 100%
- Accident: (12.5+50) × 1.1 = 68.75%
```

### Scenario 3: Reject Due to Alcohol
```
Alcohol: +100 (exceeds 75)

For Disability:
- alcoholAdj = -1 (REJECT)
- Result: -100% (rejection code)
```

---

## 🔍 Service Architecture

### Main Services
```typescript
LifeService               // Orchestrator
├── ImcService           // BMI tables
├── TobaccoService       // Tobacco tables
├── AlcoholService       // Alcohol tables
├── CholesterolService   // Cholesterol tables
├── BloodPressureService // Blood pressure matrix
├── FactorService        // lifeFactor calculation
└── InsuranceService     // Final calculations
```

### Key Methods
```typescript
// In LifeService
calculateLifeInsurances(lifeFields, healthForm, callback, applicantId): Insurance[]

// In InsuranceService
calcLife(lifeSurcharges, lifeFactor): number
calcDisability(lifeSurcharges, lifeFactor): number
calcAccident(lifeSurcharges, lifeFactor): number
calcSeriousIllness(lifeSurcharges, lifeFactor): number
calcIlt(lifeSurcharges, lifeFactor): number
calcInMax(lifeFactor): number
```

---

## 🐛 Common Mistakes

### ❌ WRONG: Using wrong IMC value for accidents
```typescript
const accident = imc + tension + tobacco;
```

### ✅ CORRECT: IMC must be halved
```typescript
const accident = (imc / 2) + tension + tobacco;
```

---

### ❌ WRONG: Using regular age for blood pressure
```typescript
const bpSurcharge = bloodPressureService.calc(regularAge, systolic, diastolic);
```

### ✅ CORRECT: Use actuarial age
```typescript
const bpSurcharge = bloodPressureService.calc(actuarialAge, systolic, diastolic);
```

---

### ❌ WRONG: Ignoring special values
```typescript
const result = imc + tension + tobacco; // Might include -1 or -2!
```

### ✅ CORRECT: Check for special values first
```typescript
const specialValue = [imc, tension, tobacco].find(s => s === -1 || s === -2);
if (specialValue) return specialValue * 100;
```

---

## 📱 Testing Quick Commands

### Test Case: Normal (No surcharges)
```typescript
// Age: 25, BMI: 22, BP: 120/80, Cholesterol: <240, No tobacco/alcohol
// Expected: All "Normal" (0% surcharge)
```

### Test Case: High BMI Only
```typescript
// Age: 26, BMI: 29.38, BP: 120/80, Cholesterol: <240, No tobacco/alcohol
// Expected:
// - Life/Disability/Serious/ILT: +25%
// - Accident: +12.5% (halved)
// - lifeFactor: 1
```

### Test Case: Rejection (Alcohol > 75)
```typescript
// Alcohol surcharge: 100
// Expected: Disability and Accident show -100% (reject)
```

---

## 📚 Related Documentation

- **Full README**: `docs/vidaNr/.../README.md` - Comprehensive calculation guide
- **Implementation Details**: `docs/readme/healthFormLife.md` - TypeScript specifics
- **Edge Cases**: `LIFE_CALCULATOR_EDGE_CASES.md` - Boundary conditions
- **Complete Guide**: `LIFE_CALCULATOR_COMPLETE_GUIDE.md` - Everything combined

---

## 🎯 Quick Decision Tree

```
Is BMI > 46? → REJECT
Is BP compensated (systolic - diastolic ≥ 20)? → NO → REJECT
Is Age 13-69? → NO → REJECT
Are all required fields filled? → NO → REJECT
Calculate partial surcharges → Check for -1/-2 → REJECT/DEFER
Calculate lifeFactor (0-5)
Calculate final insurances
Is Life > inMax? → YES → REJECT ALL
→ Return results ✓
```

---

**Last Updated**: May 2026  
**Version**: 1.0 (TypeScript Implementation)  
**Original Source**: VidaNr Webpack Calculator (2022) → FoxPro DaVinci30
