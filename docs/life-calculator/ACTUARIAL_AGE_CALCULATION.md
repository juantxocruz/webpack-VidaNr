# Actuarial Age Calculation - "Age Nearest Birthday"

**Understanding and implementing the correct actuarial age calculation for life insurance**

---

## 📑 Table of Contents

1. [What is Actuarial Age?](#what-is-actuarial-age)
2. [The Bug That Was Fixed](#the-bug-that-was-fixed)
3. [The Correct Implementation](#the-correct-implementation)
4. [Real-World Examples](#real-world-examples)
5. [Testing Edge Cases](#testing-edge-cases)
6. [Implementation Guide](#implementation-guide)
7. [Common Mistakes](#common-mistakes)

---

## 🎯 What is Actuarial Age?

### Definition

**Actuarial Age** = Your age on your **nearest birthday** (past or future)

**Regular Age** = Your age today (chronological age)

### From the Original FoxPro Code

```foxpro
lnEdad = IIF(!EMPTY(PERSONAS.FNAC),CALCEDAD(PERSONAS.FNAC),0)
&& Ojo, CALCEDAD calcula la Edad Actuarial, no la real. 
&& Es la edad que tienes en tu cumpleaños más cercano, sea el pasado o el futuro 
&& (cuando tienes 20,6 años ya tienes 21 por ejemplo)
```

**Translation:**
> "Note: CALCEDAD calculates Actuarial Age, not real age. It's the age you have on your NEAREST birthday, whether past or future (when you're 20.6 years old, you already have 21 for example)"

### Why It Matters

**Actuarial age is used for:**
- ✅ IMC (BMI) surcharge calculations
- ✅ Blood pressure surcharge calculations  
- ✅ Cholesterol surcharge calculations

**Regular age is used for:**
- ✅ Age validation (13-69 range)
- ✅ Display purposes
- ✅ User interface

### Example Scenario

```
Person born: May 5, 1998
Today: May 7, 2026

Regular Age: 28 years, 2 days
Actuarial Age: 28 years (closer to past birthday)

---

Person born: May 5, 1998
Today: November 7, 2026

Regular Age: 28 years, 6 months, 2 days
Actuarial Age: 29 years (closer to next birthday)
```

---

## 🐛 The Bug That Was Fixed

### The Problem

The original implementation had **three different versions** with inconsistent results:

#### Version 1: Original FoxPro (DaVinci) ✅ CORRECT
```foxpro
* Calculate days to next birthday and from last birthday
* Return age of nearest birthday
```

#### Version 2: JavaScript (helpers.js) ❌ BUG
```javascript
// BUG: Always used last year for past birthday
const pastBirthday = new Date(today.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());
//                             ^^^^^^^^^^^^^^^^^^^^^^^^^^
//                             ALWAYS subtracts 1 year!
```

#### Version 3: Angular (AgesService) ❌ DIFFERENT LOGIC
```typescript
// Used "days since last birthday > 182" rule
// Not true "Age Nearest Birthday"
```

### The Bug in Action

**Test Case: Person born May 5, 1998, checked on May 7, 2026**

```javascript
// BUGGY CODE (helpers.js before fix)
const pastBirthday = new Date(2026 - 1, 4, 5);  // May 5, 2025
const daysFromPast = calculateDays(pastBirthday, today);  // ~367 days
const daysToNext = calculateDays(today, nextBirthday);    // ~363 days

// BUG: 363 < 367, so it thinks NEXT birthday is closer!
actuarialAge = 28 + 1 = 29  // ❌ WRONG (should be 28)
```

**Reality:**
- Last birthday: May 5, **2026** (2 days ago)
- Next birthday: May 5, 2027 (363 days away)  
- **2 < 363** → Closer to PAST birthday
- Actuarial age should be **28**, not 29

---

## ✅ The Correct Implementation

### The Fix

```javascript
export function calculate_age(birthDate) {
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

  // ✅ FIXED: Calculate last birthday correctly
  const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (lastBirthday > today) {
    lastBirthday.setFullYear(today.getFullYear() - 1);
  }

  // Calculate days to next birthday and from last birthday
  const daysToNextBirthday = calculate_days_simple(today, nextBirthday);
  const daysFromLastBirthday = calculate_days_simple(lastBirthday, today);

  // Actuarial age: age on nearest birthday (original FoxPro logic)
  // "Es la edad que tienes en tu cumpleaños más cercano, sea el pasado o el futuro"
  const actuarialAge = daysToNextBirthday < daysFromLastBirthday ? regularAge + 1 : regularAge;

  return { regular: regularAge, actuarial: actuarialAge };
}

function calculate_days_simple(date1, date2) {
  return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}
```

### Key Changes

**Before (WRONG):**
```javascript
const pastBirthday = new Date(today.getFullYear() - 1, birthDate.getMonth(), birthDate.getDate());
// Always uses last year!
```

**After (CORRECT):**
```javascript
const lastBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
if (lastBirthday > today) {
  lastBirthday.setFullYear(today.getFullYear() - 1);
}
// Uses this year if birthday has passed, otherwise last year
```

---

## 📊 Real-World Examples

### Example 1: Just After Birthday ✅

**Input:**
- Birth Date: May 5, 1998
- Check Date: May 7, 2026 (2 days after birthday)

**Calculation:**
```
Regular Age: 28 years
Last Birthday: May 5, 2026 (2 days ago)
Next Birthday: May 5, 2027 (~363 days away)

Days from last: 2
Days to next: 363

2 < 363 → Closer to PAST birthday
Actuarial Age: 28 ✓
```

---

### Example 2: Just Before Birthday ✅

**Input:**
- Birth Date: May 5, 1998
- Check Date: May 3, 2026 (2 days before birthday)

**Calculation:**
```
Regular Age: 27 years
Last Birthday: May 5, 2025 (~363 days ago)
Next Birthday: May 5, 2026 (2 days away)

Days from last: 363
Days to next: 2

2 < 363 → Closer to NEXT birthday
Actuarial Age: 28 ✓
```

---

### Example 3: Exactly 6 Months After Birthday ⚖️

**Input:**
- Birth Date: May 5, 1998
- Check Date: November 5, 2026 (exactly 6 months after)

**Calculation:**
```
Regular Age: 28 years
Last Birthday: May 5, 2026 (~183 days ago)
Next Birthday: May 5, 2027 (~182 days away)

Days from last: 183
Days to next: 182

182 < 183 → Closer to NEXT birthday (by 1 day!)
Actuarial Age: 29 ✓
```

**Note:** At exact 6 months, you're slightly closer to the next birthday due to how leap years and month lengths vary.

---

### Example 4: On Your Birthday 🎂

**Input:**
- Birth Date: May 5, 1998
- Check Date: May 5, 2026 (birthday!)

**Calculation:**
```
Regular Age: 28 years
Last Birthday: May 5, 2026 (0 days ago = TODAY)
Next Birthday: May 5, 2027 (365 days away)

Days from last: 0
Days to next: 365

0 < 365 → Closer to PAST birthday (which is today!)
Actuarial Age: 28 ✓
```

---

### Example 5: Edge of Year Boundary 🎆

**Input:**
- Birth Date: August 7, 1990
- Check Date: May 7, 2026

**Calculation:**
```
Regular Age: 35 years (hasn't reached birthday this year)
Last Birthday: August 7, 2025 (~273 days ago)
Next Birthday: August 7, 2026 (~92 days away)

Days from last: 273
Days to next: 92

92 < 273 → Closer to NEXT birthday
Actuarial Age: 36 ✓
```

**Use Case:** This demonstrates actuarial age rounding up in the second half of your birth year cycle.

---

## 🧪 Testing Edge Cases

### Test Suite Template

```javascript
describe('Actuarial Age Calculation', () => {
  
  test('Just after birthday (2 days)', () => {
    const birthDate = new Date('1998-05-05');
    const checkDate = new Date('2026-05-07');
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(28);
    expect(result.actuarial).toBe(28);  // Closer to past
  });
  
  test('Just before birthday (2 days)', () => {
    const birthDate = new Date('1998-05-05');
    const checkDate = new Date('2026-05-03');
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(27);
    expect(result.actuarial).toBe(28);  // Closer to next
  });
  
  test('Exactly 6 months after birthday', () => {
    const birthDate = new Date('1998-05-05');
    const checkDate = new Date('2026-11-05');
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(28);
    expect(result.actuarial).toBe(29);  // Slightly closer to next
  });
  
  test('On birthday', () => {
    const birthDate = new Date('1998-05-05');
    const checkDate = new Date('2026-05-05');
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(28);
    expect(result.actuarial).toBe(28);  // Same as regular
  });
  
  test('New Year edge case', () => {
    const birthDate = new Date('1990-08-07');
    const checkDate = new Date('2026-05-07');
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(35);
    expect(result.actuarial).toBe(36);  // Closer to next
  });
  
  test('Leap year birthday', () => {
    const birthDate = new Date('1992-02-29');  // Leap year birth
    const checkDate = new Date('2026-02-28');  // Non-leap year
    const result = calculate_age(birthDate, checkDate);
    
    expect(result.regular).toBe(33);
    // Actuarial should handle Feb 29 → Feb 28 correctly
  });
});
```

---

## 🛠️ Implementation Guide

### For JavaScript/TypeScript

```javascript
// Step 1: Calculate regular age first
let regularAge = today.getFullYear() - birth.getFullYear();
if (today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
  regularAge--;
}

// Step 2: Calculate next birthday
const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
if (nextBirthday < today) {
  nextBirthday.setFullYear(today.getFullYear() + 1);
}

// Step 3: Calculate last birthday (KEY FIX)
const lastBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
if (lastBirthday > today) {
  lastBirthday.setFullYear(today.getFullYear() - 1);
}

// Step 4: Calculate days
const daysToNext = Math.floor((nextBirthday - today) / (1000 * 60 * 60 * 24));
const daysFromLast = Math.floor((today - lastBirthday) / (1000 * 60 * 60 * 24));

// Step 5: Determine actuarial age
const actuarialAge = daysToNext < daysFromLast ? regularAge + 1 : regularAge;
```

### For Angular/TypeScript Service

```typescript
@Injectable({ providedIn: 'root' })
export class AgesService {
  
  calculateAges(birthDate: string): { regularAge: number; actuarialAge: number } {
    const birth = new Date(birthDate);
    const today = new Date();

    // Calculate regular age
    let regularAge = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      regularAge--;
    }

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Calculate last birthday (FIXED)
    const lastBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (lastBirthday > today) {
      lastBirthday.setFullYear(today.getFullYear() - 1);
    }

    // Calculate days
    const daysToNext = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysFromLast = Math.floor((today.getTime() - lastBirthday.getTime()) / (1000 * 60 * 60 * 24));

    // Actuarial age: age on nearest birthday
    const actuarialAge = daysToNext < daysFromLast ? regularAge + 1 : regularAge;

    return { regularAge, actuarialAge };
  }
}
```

---

## ⚠️ Common Mistakes

### Mistake 1: Always Subtracting a Year ❌
```javascript
// WRONG
const lastBirthday = new Date(today.getFullYear() - 1, birth.getMonth(), birth.getDate());
```

**Problem:** If birthday has already occurred this year, last birthday should be this year!

---

### Mistake 2: Using Days Since Birthday > 182 ❌
```javascript
// WRONG - Oversimplified logic
const daysSinceBirthday = calculateDaysSinceLastBirthday(today, birth);
const actuarialAge = daysSinceBirthday > 182 ? regularAge + 1 : regularAge;
```

**Problem:** This assumes all years have exactly 365 days. Leap years, different month lengths, etc., make this inaccurate.

---

### Mistake 3: Not Handling Birthday Edge Case ❌
```javascript
// WRONG - What if today IS the birthday?
if (nextBirthday === today) {
  // Code doesn't handle this case
}
```

**Solution:** The correct implementation naturally handles this (daysFromLast = 0, daysToNext = 365).

---

### Mistake 4: Wrong Comparison Direction ❌
```javascript
// WRONG
const actuarialAge = daysFromLast < daysToNext ? regularAge + 1 : regularAge;
//                   ^^^^^^^^^^^^^^^^^^^^^^ Backwards!
```

**Correct:**
```javascript
const actuarialAge = daysToNext < daysFromLast ? regularAge + 1 : regularAge;
//                   ^^^^^^^^^^^^^^^^^^^^^^ Compare days TO next
```

---

## 📚 References

- **Original FoxPro Code:** `fixes/Código orig VidaNR en Davinci30.rtf`
- **Actuarial Age Fix Documentation:** `fixes/ACTUARIAL_AGE_CALCULATION_FIX.md`
- **JavaScript Implementation:** `src/scripts/helpers.js` (calculate_age function)
- **Wikipedia:** [Age in Insurance](https://en.wikipedia.org/wiki/Age_in_insurance)

---

## 🎯 Summary

### The Golden Rule
> **Actuarial Age = Age on nearest birthday (past or future)**

### Implementation Checklist
- [ ] Calculate regular age correctly
- [ ] Calculate next birthday (this year or next)
- [ ] Calculate last birthday (this year or last) ← **KEY FIX**
- [ ] Count days in both directions
- [ ] Compare: daysToNext < daysFromLast → round up
- [ ] Return both regular and actuarial ages
- [ ] Use actuarial age for IMC, BP, Cholesterol lookups
- [ ] Use regular age for validation and display

### Impact on Calculations
This fix ensures:
- ✅ Correct IMC surcharges (age boundaries: 34, 55)
- ✅ Correct blood pressure surcharges (age groups)
- ✅ Correct cholesterol surcharges (age thresholds)
- ✅ Consistency with original FoxPro business logic
- ✅ Actuarial standards compliance
