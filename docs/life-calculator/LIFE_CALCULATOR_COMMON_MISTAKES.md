# Life Calculator Common Mistakes Guide

**Learn from common pitfalls and avoid implementation errors**

---

## 🎯 Top 10 Most Common Mistakes

### 1. ❌ **Forgetting to Halve IMC for Accidents**

**WRONG**:
```typescript
const accident = 
  imc.FALLECIMIENTO + 
  bloodPressure + 
  tobacco.FALLECIMIENTO + 
  alcohol.FALLECIMIENTO + 
  cholesterol;
```

**CORRECT**:
```typescript
const accident = 
  (imc.FALLECIMIENTO / 2) +  // ← Must divide by 2!
  bloodPressure + 
  tobacco.FALLECIMIENTO + 
  alcohol.FALLECIMIENTO + 
  cholesterol;
```

**Why**: Actuarial logic - BMI affects long-term health risks more than accident risk.

**Test**: If Life IMC = 25%, Accident IMC should always = 12.5%

---

### 2. ❌ **Using Wrong Age (Regular vs Actuarial)**

**WRONG**:
```typescript
// Using regular age everywhere
const bmiSurcharge = imcService.calcImc(bmi, regularAge);
const bpSurcharge = bloodPressureService.calc(regularAge, systolic, diastolic);
const cholesterolSurcharge = cholesterolService.calc(cholesterol, regularAge);
```

**CORRECT**:
```typescript
// Know which functions need actuarial age
const bmiSurcharge = imcService.calcImc(bmi, actuarialAge);          // ← Actuarial!
const bpSurcharge = bloodPressureService.calc(actuarialAge, systolic, diastolic);  // ← Actuarial!
const cholesterolSurcharge = cholesterolService.calc(cholesterol, actuarialAge);   // ← Actuarial!

// Some use regular age
const tobaccoSurcharge = tobaccoService.calc(units, asthma); // ← No age!
```

**Remember**:
- **Actuarial age**: BMI, Blood Pressure, Cholesterol
- **Regular age**: Age validation, display
- **No age**: Tobacco (just units)

---

### 3. ❌ **Not Checking for Special Values Before Calculation**

**WRONG**:
```typescript
// Continuing calculation even if special values exist
const total = imc + bloodPressure + tobacco + alcohol + cholesterol;
return Math.round(total * factorAdjustment) * 25;
// If imc = -1, total would be invalid!
```

**CORRECT**:
```typescript
// Check first!
const surcharges = [imc, bloodPressure, tobacco, alcohol, cholesterol];
const specialValue = surcharges.find(s => s === -1 || s === -2);
if (specialValue !== undefined) {
  return specialValue * 100; // Return -100 or -200
}

// Now safe to calculate
const total = imc + bloodPressure + tobacco + alcohol + cholesterol;
return Math.round(total * factorAdjustment) * 25;
```

---

### 4. ❌ **Wrong Multiplier for Serious Illness**

**WRONG**:
```typescript
// Using 1.1 for all insurances
const seriousIllness = Math.round(
  (imc + bloodPressure + (tobacco * 1.5) + alcohol + cholesterol) 
  * (Math.pow(1.1, lifeFactor - 1) / 25)  // ← Should be 1.2!
) * 25;
```

**CORRECT**:
```typescript
// Serious Illness uses 1.2, not 1.1
const seriousIllness = Math.round(
  (imc + bloodPressure + (tobacco * 1.5) + alcohol + cholesterol) 
  * (Math.pow(1.2, lifeFactor - 1) / 25)  // ← 1.2 for serious illness!
) * 25;
```

**Multipliers by Insurance Type**:
- Life, Disability, Accident, ILT: **1.1**
- Serious Illness: **1.2**

---

### 5. ❌ **Using Life Tables for ILT**

**WRONG**:
```typescript
// Using wrong tables
const ilt = Math.round(
  (imc.FALLECIMIENTO +           // ❌ Should be imc.ILT
   bloodPressure + 
   tobacco.FALLECIMIENTO +       // ❌ Should be tobacco.ILT
   alcohol.FALLECIMIENTO +       // ❌ Should be alcohol.ILT
   cholesterol) 
  * factorAdjustment
) * 25;
```

**CORRECT**:
```typescript
// ILT has separate tables
const ilt = Math.round(
  (imc.ILT +              // ✅ ILT table
   bloodPressure +        // ✅ Same table (no ILT variant)
   tobacco.ILT +          // ✅ ILT table
   alcohol.ILT +          // ✅ ILT table
   cholesterol)           // ✅ Same table (no ILT variant)
  * factorAdjustment
) * 25;
```

**Tables with ILT variants**:
- IMC: ✅ Has ILT table
- Tobacco: ✅ Has ILT table
- Alcohol: ✅ Has ILT table
- Blood Pressure: ❌ No ILT variant (same for all)
- Cholesterol: ❌ No ILT variant (same for all)

---

### 6. ❌ **Forgetting Tobacco 1.5× Multiplier for Serious Illness**

**WRONG**:
```typescript
const seriousIllness = Math.round(
  (imc + bloodPressure + tobacco + alcohol + cholesterol)  // ❌ Tobacco not multiplied
  * (Math.pow(1.2, lifeFactor - 1) / 25)
) * 25;
```

**CORRECT**:
```typescript
const seriousIllness = Math.round(
  (imc + bloodPressure + (tobacco * 1.5) + alcohol + cholesterol)  // ✅ Tobacco × 1.5
  * (Math.pow(1.2, lifeFactor - 1) / 25)
) * 25;
```

**Special formula adjustments**:
- Accidents: IMC / 2
- Serious Illness: Tobacco × 1.5, multiplier = 1.2

---

### 7. ❌ **Wrong Alcohol Rejection Logic**

**WRONG**:
```typescript
// Rejecting all insurances when alcohol > 75
if (alcohol > 75) {
  return {
    life: -100,
    disability: -100,
    accident: -100,
    seriousIllness: -100,
    ilt: -100
  };
}
```

**CORRECT**:
```typescript
// Only Disability and Accident reject alcohol > 75
// Life and Serious Illness accept any value

calcDisability() {
  const alcoholAdj = alcohol <= 75 ? alcohol : -1;  // ← Reject if >75
  // ... rest of calculation
}

calcAccident() {
  const alcoholAdj = alcohol <= 75 ? alcohol : -1;  // ← Reject if >75
  // ... rest of calculation
}

calcLife() {
  // ✅ No rejection for alcohol, uses actual value
  const total = imc + bloodPressure + tobacco + alcohol + cholesterol;
}

calcSeriousIllness() {
  // ✅ No rejection for alcohol, uses actual value
  const total = imc + bloodPressure + (tobacco * 1.5) + alcohol + cholesterol;
}
```

---

### 8. ❌ **Ignoring Blood Pressure Compensation Check**

**WRONG**:
```typescript
// Not checking if BP is compensated
const systolic = 120;
const diastolic = 105;
// Difference = 15 (< 20, should reject!)

const bpSurcharge = bloodPressureService.calc(age, systolic, diastolic);
// Would try to calculate anyway
```

**CORRECT**:
```typescript
// Check compensation BEFORE calling service
const systolic = 120;
const diastolic = 105;

if (systolic - diastolic < 20) {
  showModal('Blood pressure is uncompensated. Difference must be ≥ 20');
  return []; // Abort
}

const bpSurcharge = bloodPressureService.calc(age, systolic, diastolic);
```

**Rule**: Systolic - Diastolic must be ≥ 20

---

### 9. ❌ **Calculating When Validation Failed**

**WRONG**:
```typescript
// Not checking validation result
const validationPassed = this.validateLifeFields(lifeFields);
// Continue anyway...
const results = this.calculateSurcharges(...);
```

**CORRECT**:
```typescript
// Stop if validation fails
if (!this.validateLifeFields(lifeFields)) {
  console.error('Validation failed');
  return []; // Early return
}

// Only calculate if validation passed
const results = this.calculateSurcharges(...);
```

**Common validation failures**:
- Age < 13 or > 69
- BMI = 0 (missing weight/height)
- BP uncompensated
- Required fields missing

---

### 10. ❌ **Not Applying Age >45 Alcohol Discount**

**WRONG**:
```typescript
// Using base surcharge for all ages
calcAlcohol(units, gender, age) {
  if (gender === 'male' && units === 6) {
    return 100; // ❌ Doesn't consider age discount
  }
}
```

**CORRECT**:
```typescript
// Apply -25 discount if age > 45
calcAlcohol(units, gender, age) {
  let surcharge = 0;
  
  if (gender === 'male' && units === 6) {
    surcharge = 100;
  }
  
  // Age discount (only for Life, not ILT!)
  if (surcharge > 0 && surcharge < 999 && age > 45) {
    surcharge -= 25;  // ✅ Discount for older ages
  }
  
  return surcharge;
}
```

**Important**: This discount **only applies to Life** calculations, not ILT!

---

## 🔍 Calculation Sequence Mistakes

### ❌ **Wrong Order of Operations**

**WRONG**:
```typescript
// Calculating final before partial surcharges
const lifeFactor = this.calcLifeFactor(...);  // ❌ Needs partial surcharges first!
const partialSurcharges = this.calcPartialSurcharges(...);
```

**CORRECT**:
```typescript
// Correct sequence
const partialSurcharges = this.calcPartialSurcharges(...);  // 1️⃣ First
const lifeFactor = this.calcLifeFactor(partialSurcharges);  // 2️⃣ Second
const finalSurcharges = this.calcFinal(partialSurcharges, lifeFactor);  // 3️⃣ Third
const inMax = this.calcInMax(lifeFactor);  // 4️⃣ Fourth
```

---

### ❌ **Forgetting inMax Check**

**WRONG**:
```typescript
// Returning results without checking inMax
const results = this.calcAllInsurances(...);
return results;  // ❌ What if Life exceeds inMax?
```

**CORRECT**:
```typescript
const results = this.calcAllInsurances(...);
const inMax = this.calcInMax(lifeFactor);

// Check if Life exceeds threshold
if (results.FALLECIMIENTO > inMax) {
  showModal('Life exceeds maximum allowed. All insurances rejected.');
  return [];  // ✅ Reject ALL insurances
}

return results;
```

**Remember**: If Life is rejected, **all** other insurances are also rejected.

---

## 🎨 Display & Formatting Mistakes

### ❌ **Displaying Basis Points Instead of Percentages**

**WRONG**:
```html
<!-- Showing 2500 instead of 25% -->
<span>{{ insurance.FALLECIMIENTO }}</span>
<!-- Shows: 2500 -->
```

**CORRECT**:
```html
<!-- Convert basis points to percentage -->
<span>{{ insurance.FALLECIMIENTO / 100 }}%</span>
<!-- Shows: 25% -->

<!-- Or use a pipe -->
<span>{{ insurance.FALLECIMIENTO | basisPointsToPercent }}</span>
```

**Conversion**: 
- Stored: 2500 (basis points × 100)
- Display: 25% (divide by 100)

---

### ❌ **Not Handling Special Values in Display**

**WRONG**:
```html
<!-- Showing -100% instead of "Rechazar" -->
<span>{{ insurance.FALLECIMIENTO }}%</span>
<!-- Shows: -100% ❌ -->
```

**CORRECT**:
```typescript
getDisplayValue(value: number): string {
  if (value === -100) return 'Rechazar';
  if (value === -200) return 'Aplazar';
  if (value === 0) return 'Normal';
  return `+${value / 100}%`;
}
```

```html
<span>{{ getDisplayValue(insurance.FALLECIMIENTO) }}</span>
<!-- Shows: "Rechazar" ✅ -->
```

---

### ❌ **Wrong Color Coding**

**WRONG**:
```typescript
// Red for all non-zero values
getColor(value: number): string {
  return value > 0 ? 'red' : 'green';
}
```

**CORRECT**:
```typescript
// Different colors for different situations
getColor(value: number): string {
  if (value < 0) return 'red';        // Reject/Defer
  if (value === 0) return 'green';    // Normal
  if (value <= 50) return 'yellow';   // Low surcharge
  if (value <= 100) return 'orange';  // Medium surcharge
  return 'red';                        // High surcharge
}
```

---

## 🧪 Testing Mistakes

### ❌ **Testing Only Happy Path**

**WRONG**:
```typescript
it('should calculate life insurance', () => {
  // Only testing normal case
  const result = service.calcLife({
    imc: 0, bloodPressure: 0, tobacco: 0, alcohol: 0, cholesterol: 0
  }, { life: 0 });
  
  expect(result).toBe(0);
});
```

**CORRECT**:
```typescript
describe('Life Insurance Calculation', () => {
  it('should calculate normal case', () => { /* ... */ });
  
  it('should return -100 when IMC is -1', () => {
    const result = service.calcLife({
      imc: { FALLECIMIENTO: -1 }, // Reject
      // ...
    }, { life: 1 });
    expect(result).toBe(-100);
  });
  
  it('should apply lifeFactor multiplier', () => { /* ... */ });
  
  it('should round to multiples of 25', () => { /* ... */ });
});
```

**Test edge cases**:
- Special values (-1, -2, 999)
- Boundary values (13, 69 age)
- lifeFactor variations (0-5)
- Rounding edge cases

---

### ❌ **Not Testing Rounding**

**WRONG**:
```typescript
// Assuming exact values
expect(result).toBe(82.5);
```

**CORRECT**:
```typescript
// Results are always multiples of 25
expect(result % 25).toBe(0);
expect([75, 100].includes(result)).toBe(true);
```

---

## 📝 Documentation Mistakes

### ❌ **Removing Original FoxPro Comments**

**WRONG**:
```typescript
// Cleaned up, removed old comments
calcLife(surcharges, factor) {
  return Math.round(total * factorAdj) * 25;
}
```

**CORRECT**:
```typescript
// Keep original formulas for traceability!
// FoxPro: lnTVida = ROUND((lnIMC + lnTension + lnFuma + lnBebe + lnColes) * (1.1 ^ (nagra - 1)) / 25, 0) * 25

calcLife(surcharges, factor) {
  return Math.round(total * factorAdj) * 25;
}
```

**Why**: Maintains institutional knowledge and allows verification against original.

---

### ❌ **Not Documenting WHY**

**WRONG**:
```typescript
// Just stating the fact
const accident = (imc / 2) + tension + tobacco + alcohol + cholesterol;
```

**CORRECT**:
```typescript
// Explaining the reasoning
// IMC is halved for accidents because BMI primarily affects long-term health
// risks rather than immediate accident susceptibility (actuarial reasoning)
const accident = (imc / 2) + tension + tobacco + alcohol + cholesterol;
```

---

## 🔐 Type Safety Mistakes

### ❌ **Using 'any' Instead of Proper Types**

**WRONG**:
```typescript
calcLife(surcharges: any, factor: any): any {
  // No type safety
}
```

**CORRECT**:
```typescript
calcLife(
  surcharges: LifePartialSurcharges, 
  factor: LifeFactor
): number {
  // Type-safe
}
```

---

### ❌ **Not Checking for Null/Undefined**

**WRONG**:
```typescript
const bmi = client.weight / (client.height * client.height);
// What if weight or height is null?
```

**CORRECT**:
```typescript
if (!client.weight || !client.height) {
  throw new Error('Weight and height required for BMI calculation');
}
const bmi = client.weight / (client.height * client.height);
```

---

## 🎓 Learning from Production Issues

### Real Issue #1: "Accident always half of Life"
**Cause**: Developer didn't know IMC should be halved  
**Solution**: ✅ This is correct! Document it clearly.

### Real Issue #2: "Different results in different environments"
**Cause**: Using regular age instead of actuarial age  
**Solution**: Standardize on actuarial age for specific calculations

### Real Issue #3: "Modal not showing for rejection"
**Cause**: Callback not provided or special values not detected  
**Solution**: Always provide modal callback, check special values

### Real Issue #4: "ILT results differ from calculator"
**Cause**: Using Life tables instead of ILT tables  
**Solution**: Use correct ILT variants

### Real Issue #5: "Alcohol >45 discount not applied"
**Cause**: Forgot to check age threshold  
**Solution**: Implement age check for alcohol discount

---

## ✅ Checklist Before Deployment

- [ ] IMC halved for accidents?
- [ ] Actuarial age used for BP, cholesterol, BMI?
- [ ] Special values checked before calculation?
- [ ] Serious Illness uses 1.2 multiplier?
- [ ] Serious Illness multiplies tobacco by 1.5?
- [ ] ILT uses separate tables?
- [ ] Alcohol >75 rejects Disability/Accident only?
- [ ] Alcohol >45 discount applied (Life only)?
- [ ] BP compensation checked (diff ≥ 20)?
- [ ] inMax threshold checked before returning?
- [ ] Results are multiples of 25?
- [ ] Special values display correctly?
- [ ] All edge cases tested?

---

## 📚 Related Documentation

- **Quick Reference**: `LIFE_CALCULATOR_QUICK_REFERENCE.md`
- **Edge Cases**: `LIFE_CALCULATOR_EDGE_CASES.md`
- **Full Guide**: `docs/vidaNr/.../README.md`

---

**Last Updated**: May 2026  
**Compiled from**: Production issues, code reviews, and developer feedback  
**Maintained By**: Development Team
