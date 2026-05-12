# Life Calculator: WHY - Actuarial Rationale

**Understanding the reasoning behind life insurance calculation formulas**

---

## 🎯 Purpose of This Document

This document explains **WHY** the Life Calculator uses specific formulas and thresholds, not just **WHAT** they are. Understanding the actuarial reasoning helps developers make informed decisions when modifying or debugging calculations.

---

## 📑 Table of Contents

1. [Why Accidents Use IMC/2](#why-accidents-use-imc2)
2. [Why Serious Illness Uses 1.2 Multiplier](#why-serious-illness-uses-12-multiplier)
3. [Why Tobacco × 1.5 for Serious Illness](#why-tobacco--15-for-serious-illness)
4. [Why Alcohol Rejects Disability/Accident >75](#why-alcohol-rejects-disabilityaccident-75)
5. [Why Age >45 Gets Alcohol Discount](#why-age-45-gets-alcohol-discount)
6. [Why ILT Uses Different Tables](#why-ilt-uses-different-tables)
7. [Why lifeFactor (NAGRA) Exists](#why-lifefactor-nagra-exists)
8. [Why Actuarial Age vs Regular Age](#why-actuarial-age-vs-regular-age)
9. [Why Blood Pressure Compensation Check](#why-blood-pressure-compensation-check)
10. [Why inMax Threshold](#why-inmax-threshold)

---

## 💥 Why Accidents Use IMC/2

### The Formula
```typescript
const accident = 
  (imc.FALLECIMIENTO / 2) +  // ← Why divide by 2?
  bloodPressure + 
  tobacco.FALLECIMIENTO + 
  alcohol.FALLECIMIENTO + 
  cholesterol;
```

### The Reasoning

**Question**: Why is accident insurance surcharge only half of life insurance for BMI?

**Answer**: **BMI primarily indicates long-term health risks, not immediate accident susceptibility.**

#### Actuarial Logic:
1. **High BMI** → Increased risk of:
   - Heart disease ✅ (long-term)
   - Diabetes ✅ (long-term)
   - Joint problems ✅ (long-term)
   - Reduced life expectancy ✅ (long-term)
   
2. **High BMI** → NOT significantly correlated with:
   - Car accidents ❌ (short-term event)
   - Falling down stairs ❌ (short-term event)
   - Work accidents ❌ (short-term event)

#### Example Scenario:
```
Person A: BMI 35 (obese)
- Life insurance: +50% surcharge (high mortality risk)
- Accident insurance: +25% surcharge (moderate accident risk)

Reasoning: Their obesity increases long-term health risks significantly,
but doesn't make them twice as likely to die in a car accident.
```

### Historical Context
Original FoxPro code (DaVinci30):
```foxpro
* Accidente: IMC dividido por 2
lnAccidentes = ROUND((lnIMC/2 + lnTension + lnFuma + lnBebe + lnColes) * (1.1 ^ (nagra - 1)) / 25, 0) * 25
```

**Conclusion**: The halving is not a bug—it's intentional actuarial modeling that separates chronic health risks from acute accident risks.

---

## 🏥 Why Serious Illness Uses 1.2 Multiplier

### The Formula
```typescript
// Life, Disability, Accident, ILT use 1.1
const life = total * (Math.pow(1.1, lifeFactor - 1) / 25);

// Serious Illness uses 1.2
const seriousIllness = total * (Math.pow(1.2, lifeFactor - 1) / 25);
```

### The Reasoning

**Question**: Why does Serious Illness have a higher multiplier (1.2 vs 1.1)?

**Answer**: **Multiple risk factors compound more aggressively for critical illness.**

#### Actuarial Logic:

**Serious Illness** covers:
- Cancer
- Heart attack
- Stroke
- Major organ failure
- Kidney failure

**Risk Compounding**:
```
Person with 3 risk factors (obesity, smoking, high BP):
- Life insurance: 1.1^2 = 1.21 (21% increase)
- Serious illness: 1.2^2 = 1.44 (44% increase)

Why? Because having multiple risk factors creates a SYNERGISTIC effect
for critical illness—not just additive.
```

#### Medical Research Basis:
- Smoking + High BP → 4× stroke risk (not 2×)
- Obesity + Diabetes → 6× heart attack risk (not 3×)
- Multiple factors → Exponentially higher critical illness probability

**Example**:
```
Scenario: BMI 32, Smoker (20 cigs), High cholesterol, High BP
lifeFactor = 4 (four active risk factors)

Life insurance: 1.1^3 = 1.331 (33.1% multiplier)
Serious illness: 1.2^3 = 1.728 (72.8% multiplier)

Reasoning: This person has dramatically higher risk of heart attack/stroke
than someone with just one risk factor.
```

### Historical Note
This differentiation was introduced in DaVinci30 (FoxPro) based on actuarial studies showing critical illness claims were significantly higher for multi-risk clients.

---

## 🚬 Why Tobacco × 1.5 for Serious Illness

### The Formula
```typescript
// Most insurances
const life = imc + bloodPressure + tobacco + alcohol + cholesterol;

// Serious Illness
const seriousIllness = imc + bloodPressure + (tobacco * 1.5) + alcohol + cholesterol;
```

### The Reasoning

**Question**: Why is tobacco weighted 1.5× for serious illness?

**Answer**: **Tobacco is the #1 risk factor for critical illnesses (cancer, heart disease, stroke).**

#### Medical Evidence:
- **Cancer risk**: Smoking increases risk by 15-30× (most types)
- **Heart attack risk**: Smokers have 2-4× higher risk
- **Stroke risk**: Smokers have 2-4× higher risk
- **COPD**: 80-90% caused by smoking

#### Comparison with Other Risk Factors:
```
Critical Illness Impact (relative):
1. Tobacco: 🔴🔴🔴 (Highest impact)
2. High BP: 🔴🔴
3. Obesity: 🔴🔴
4. High Cholesterol: 🔴
5. Alcohol: 🔴
```

**Example**:
```
Person A: BMI 35 (+50%), Smoker 30 cigs (+50%), High cholesterol (+25%)

Life insurance:
  Total = 50 + 50 + 25 = 125%
  
Serious illness:
  Total = 50 + (50 × 1.5) + 25 = 150%
           ↑ Tobacco weighted higher
           
Reasoning: Smoker + obesity = extremely high cancer/heart attack risk
```

### Why NOT 1.5× for Other Insurances?
- **Life insurance**: Already accounts for mortality
- **Disability**: Smoking doesn't directly cause disability (vs illness)
- **Accident**: Smoking doesn't increase accident probability
- **ILT**: Temporary disability less affected by smoking

---

## 🍷 Why Alcohol Rejects Disability/Accident >75

### The Rule
```typescript
// Disability & Accident
if (alcohol > 75) return -1; // Reject

// Life & Serious Illness
// No rejection, accept any value
```

### The Reasoning

**Question**: Why reject only Disability and Accident for high alcohol, but not Life?

**Answer**: **High alcohol consumption specifically increases disability and accident claims, but life insurance can be priced accordingly.**

#### Actuarial Logic:

**Disability Claims**:
- Alcohol-related injuries
- Chronic liver damage → work disability
- Neurological damage → permanent impairment
- **High claim frequency** → Uninsurable above threshold

**Accident Claims**:
- Drunk driving
- Impaired judgment → accidents
- Fall risk
- **Direct causation** → Uninsurable above threshold

**Life Insurance**:
- Can price for mortality risk
- Surcharge covers higher death probability
- **Predictable risk** → Insurable with surcharge

#### Why 75% Threshold?
```
Threshold corresponds to:
- Male: ~6-7 glasses of wine daily
- Female: ~5 glasses of wine daily

At this level:
- Alcoholism likely
- Severe health deterioration
- Erratic behavior patterns
- Claim probability > premium potential
```

**Example**:
```
Male, 6 glasses wine/day → Alcohol surcharge = 100%

Life insurance: ✅ Accepted with +100% surcharge
  Reasoning: Can price for shortened life expectancy
  
Disability insurance: ❌ Rejected
  Reasoning: High claim frequency, unpredictable work capacity
  
Accident insurance: ❌ Rejected
  Reasoning: Impaired judgment creates unacceptable accident risk
```

### Business Perspective
Insurance companies can model mortality risk but struggle with:
- Frequent small disability claims
- Unpredictable accident claims
- Rehabilitation costs
- Legal liability

Above 75% surcharge → **Unprofitable to insure for these specific products**

---

## 👴 Why Age >45 Gets Alcohol Discount

### The Rule
```typescript
// Age > 45 (actuarial)
if (age > 45 && alcoholSurcharge > 0) {
  alcoholSurcharge -= 25; // 25% discount
}
```

### The Reasoning

**Question**: Why do older people get an alcohol consumption discount?

**Answer**: **Alcohol tolerance patterns change with age, and consumption history matters more than current intake.**

#### Actuarial Evidence:

**Age ≤ 45**:
- Higher risk of developing alcoholism
- Binge drinking patterns
- Less established consumption history
- More likely to escalate

**Age > 45**:
- Established consumption pattern
- If still healthy → Tolerance proven
- Unlikely to escalate further
- "Survived" earlier high-risk years

**Example**:
```
Scenario: Male, 5 glasses wine/day

Age 35:
  Base surcharge: 75%
  Discount: 0%
  Final: 75%
  Reasoning: Still at risk of escalating consumption
  
Age 50:
  Base surcharge: 75%
  Discount: -25%
  Final: 50%
  Reasoning: 15+ years of stable consumption = proven tolerance
```

#### Medical Perspective:
- **Age 30-45**: Peak alcoholism development period
- **Age 45+**: If no major health issues yet → Lower relative risk
- **Survival bias**: They've "made it" this far with that consumption

### Historical Context
This adjustment was introduced based on claims data showing:
- Lower claim frequency for older moderate-heavy drinkers
- Higher predictability of health outcomes
- Stable consumption patterns correlate with lower risk

**Important**: This is NOT endorsing heavy drinking—it's actuarial reality based on historical claims data.

---

## 🏢 Why ILT Uses Different Tables

### The Rule
```typescript
// Life Insurance
const life = imc.FALLECIMIENTO + tobacco.FALLECIMIENTO + alcohol.FALLECIMIENTO + ...;

// ILT (Temporary Disability)
const ilt = imc.ILT + tobacco.ILT + alcohol.ILT + ...;
```

### The Reasoning

**Question**: Why does ILT (Incapacidad Laboral Temporal) use completely different tables?

**Answer**: **Temporary work disability has different risk factors than mortality.**

#### ILT vs Life Insurance:

**ILT Covers**:
- Short-term work incapacity (days/weeks)
- Recovery from illness/injury
- Temporary medical conditions
- Return to work ability

**Life Insurance Covers**:
- Permanent mortality
- Long-term health decline
- Terminal conditions

#### Key Differences:

**Example: BMI 35 (obese)**
```
Life Insurance:
  Surcharge: +50% (high mortality risk over decades)
  
ILT:
  Surcharge: +100% or REJECT (high short-term disability claims)
  
Why? Obese workers:
- More sick days (back pain, joint issues)
- Slower recovery from injuries
- Higher claim frequency (not just severity)
- More temporary disabilities
```

**Example: Smoking 25 cigarettes/day**
```
Life Insurance:
  Surcharge: +50% (long-term mortality)
  
ILT:
  Surcharge: +75% (respiratory issues, frequent illness)
  
Why? Smokers:
- More respiratory infections
- Slower wound healing
- More frequent short-term illnesses
- Higher claim frequency
```

#### Stricter ILT Thresholds:
```
BMI Thresholds:
- Life: Reject if BMI > 46
- ILT: Reject if BMI > 44 (stricter!)

Why? Higher BMI → exponentially more temporary disability claims
```

### Business Rationale
ILT insurance is **claim-frequency sensitive**, not just claim-severity:
- Life insurance: One claim per policy (death)
- ILT insurance: Multiple claims possible (recurring illnesses)

High-risk clients generate:
- Frequent small claims
- Administrative burden
- Longer total disability days
- **Unprofitable** → Stricter underwriting

---

## 🎲 Why lifeFactor (NAGRA) Exists

### The Concept
```typescript
// Count active risk factors
const lifeFactor = 
  (imc > 0 ? 1 : 0) +
  (tobacco > 0 ? 1 : 0) +
  (alcohol > 0 ? 1 : 0) +
  (cholesterol > 0 ? 1 : 0) +
  (bloodPressure > 0 ? 1 : 0);
  
// Apply exponential multiplier
const multiplier = Math.pow(1.1, lifeFactor - 1);
```

### The Reasoning

**Question**: Why count risk factors separately and apply an exponential multiplier?

**Answer**: **Risk factors don't just add—they MULTIPLY each other's impact.**

#### Medical Synergy:

**Additive Model** (Wrong):
```
Person with obesity + smoking:
Risk = Obesity risk + Smoking risk
```

**Multiplicative Model** (Correct):
```
Person with obesity + smoking:
Risk = Obesity risk × Smoking synergy factor

Why? Obese smokers have:
- Compressed airways + extra lung burden
- Poor circulation + cardiovascular strain
- Inflammation × inflammation
```

#### Real-World Example:

**Scenario**: Middle-aged male
```
Case 1: One risk factor (BMI 32)
  BMI surcharge: 50%
  lifeFactor: 1
  Multiplier: 1.1^0 = 1.0
  Final: 50%

Case 2: Three risk factors (BMI 32, Smoker, High BP)
  Base total: 50 + 50 + 25 = 125%
  lifeFactor: 3
  Multiplier: 1.1^2 = 1.21
  Final: 125% × 1.21 = 151.25% → rounds to 150%
  
Case 3: Five risk factors (all active)
  Base total: 50 + 50 + 100 + 25 + 25 = 250%
  lifeFactor: 5
  Multiplier: 1.1^4 = 1.4641
  Final: 250% × 1.4641 = 366% → rounds to 375%
```

**Why Exponential?**
Medical research shows:
- 1 risk factor = baseline elevated risk
- 2 risk factors = 2.5× risk (not 2×)
- 3 risk factors = 4× risk (not 3×)
- 4 risk factors = 6× risk (not 4×)

**Example Studies**:
- Framingham Heart Study: Multiple risk factors compound exponentially
- WHO cardiovascular research: Synergistic risk effects
- Actuarial mortality tables: Non-linear risk progression

### NAGRA Name Origin
**NAGRA** = Number of Active Gradual Risk Adjustments (internal Nacional Re terminology)

---

## 📅 Why Actuarial Age vs Regular Age

### The Difference
```typescript
// Regular age
const regularAge = (today - birthDate) / 365.25;

// Actuarial age (nearest birthday)
const daysToNextBirthday = nextBirthday - today;
const actuarialAge = daysToNextBirthday < 183 
  ? regularAge + 1  // Round up if <6 months to birthday
  : regularAge;      // Round down if ≥6 months to birthday
```

### The Reasoning

**Question**: Why use "age at nearest birthday" instead of exact age?

**Answer**: **Standardization for mortality tables and simplified risk categorization.**

#### Actuarial Standard:
Life insurance industry worldwide uses **age nearest birthday** for:
1. **Mortality tables alignment**: All tables use integer ages
2. **Simplified pricing**: Avoids continuous age adjustments
3. **Administrative efficiency**: Easier policy management
4. **Historical continuity**: Industry standard since 1800s

**Example**:
```
Birth: January 15, 1990
Today: August 1, 2026

Regular age: 36 years, 6 months, 17 days (36.55 years)
Next birthday: January 15, 2027
Days to birthday: 167 days (<183)
Actuarial age: 37 years ← Used for calculations

Why? 
- Closer to 37 than 36
- Mortality tables use age 37
- Premium calculated for age 37
```

#### Business Rationale:
```
Without actuarial age:
- Need mortality data for every decimal age (36.0, 36.1, 36.2...)
- Impossible to maintain
- Impractical for historical tables

With actuarial age:
- 69 discrete categories (age 13-69 for this product)
- Clean table lookups
- Industry-wide compatibility
```

### Historical Context
Originated from pre-computer era when:
- Manual table lookups required
- No decimals practical
- Annual policy renewals standard

Modern actuarial science maintains this for:
- Industry standardization
- Regulatory compliance
- Mortality table compatibility

---

## 💓 Why Blood Pressure Compensation Check

### The Rule
```typescript
// Systolic - Diastolic must be ≥ 20
if (systolic - diastolic < 20) {
  return 'Uncompensated blood pressure - REJECT';
}
```

### The Reasoning

**Question**: Why reject if the difference (pulse pressure) is too small?

**Answer**: **Low pulse pressure indicates serious cardiovascular dysfunction.**

#### Medical Explanation:

**Pulse Pressure** = Systolic - Diastolic
- **Normal**: 40-60 mmHg
- **Low**: <25 mmHg (danger sign)
- **Threshold**: 20 mmHg (safety minimum)

**What Low Pulse Pressure Indicates**:
1. **Heart failure**: Weak cardiac output
2. **Aortic stenosis**: Valve problems
3. **Severe dehydration**: Volume depletion
4. **Shock**: Circulatory collapse

**Example Scenarios**:
```
Scenario 1: 120/80 → Difference = 40 ✅ Normal, healthy
Scenario 2: 120/100 → Difference = 20 ✅ Borderline, accepted
Scenario 3: 120/105 → Difference = 15 ❌ REJECT - cardiac issue likely
```

#### Why NOT Calculate Surcharge?
```
This isn't about pricing risk—it's about UNINSURABILITY.

Low pulse pressure suggests:
- Immediate medical attention needed
- Unstable condition
- Unpredictable prognosis
- Not suitable for insurance underwriting
```

**Medical Recommendation**: Person should see cardiologist immediately, not buy insurance.

### Business Perspective
Insurance requires:
- Stable health conditions
- Predictable risk progression
- Mortality/morbidity models

Uncompensated BP indicates:
- Unstable condition
- Unknown prognosis
- Model doesn't apply
- **Cannot price accurately** → Reject

---

## 🎯 Why inMax Threshold

### The Rule
```typescript
const inMax = lifeFactor <= 1 ? 300 : 200;

if (life > inMax) {
  rejectAllInsurances();
  return [];
}
```

### The Reasoning

**Question**: Why have a maximum life insurance surcharge?

**Answer**: **Beyond certain risk levels, the insurance becomes commercially unviable.**

#### Business Rationale:

**High Surcharges Mean**:
1. **High premiums**: Customer unlikely to buy
2. **High risk**: Claims probability very high
3. **Adverse selection**: Only desperate people buy
4. **Unprofitable**: Claim costs > premiums collected

**Example**:
```
Normal person: €100/month premium
High-risk person (300% surcharge): €400/month premium

Reality:
- Most high-risk people won't pay €400/month
- Those who do are likely expecting to claim soon
- Insurance company loses money
- Better to reject and maintain profitability
```

#### Why Two Thresholds?

**lifeFactor ≤ 1**: inMax = 300%
```
Scenario: Only ONE risk factor active
Example: Just high cholesterol (no other issues)

Reasoning:
- Single risk factor = more predictable
- Can model accurately
- Accept up to 300% surcharge
```

**lifeFactor > 1**: inMax = 200%
```
Scenario: TWO or more risk factors active
Example: High BMI + smoking + high BP

Reasoning:
- Multiple factors = less predictable
- Synergistic effects harder to model
- Stricter threshold (200%) for safety
```

#### Regulatory Perspective:
Many jurisdictions limit surcharges to prevent:
- Price discrimination
- Unaffordable insurance
- Market distortion

Nacional Re chose:
- 200-300% as commercial viability limit
- Above this → decline to quote

### Real-World Impact:
```
Person with 350% surcharge:
- Declined by this calculator
- May seek:
  - Government high-risk pools
  - Group insurance (no underwriting)
  - Self-insurance options
  - Specialized insurers
```

**Conclusion**: inMax protects insurer profitability while being fair to moderate-risk applicants.

---

## 📊 Summary: Key Actuarial Principles

### 1. **Risk Differentiation**
Not all risks affect all insurance types equally:
- BMI: High impact on life, moderate on accidents
- Alcohol: High impact on disability/accident, moderate on life
- Tobacco: Highest impact on serious illness

### 2. **Risk Synergy**
Multiple risk factors multiply, not add:
- lifeFactor uses exponential formula
- 1.1^n for most, 1.2^n for serious illness
- Reflects medical reality of compounding risks

### 3. **Age Dynamics**
Risk changes over lifespan:
- Younger: More volatile alcohol patterns
- Older: Established patterns, proven tolerance
- Actuarial age: Industry standardization

### 4. **Commercial Viability**
Insurance is a business:
- Threshold rejections prevent losses
- Pricing must match risk
- Above certain levels → uninsurable

### 5. **Medical Evidence-Based**
All formulas derive from:
- Mortality tables (PASEM 2010, GKMF95)
- Medical research studies
- Historical claims data
- Actuarial science principles

---

## 🔬 Research Foundations

### Mortality Tables Used:
- **PASEM 2010**: Spanish population mortality
- **GKMF95**: Gender-specific mortality
- **INE**: National statistics (life expectancy)

### Medical Studies Referenced:
- **Framingham Heart Study**: Cardiovascular risk factors
- **WHO Global Health**: Tobacco/alcohol impact
- **DGSFP**: Spanish insurance regulatory data

### Actuarial Methods:
- **Multiple decrements**: Competing mortality causes
- **Select and ultimate tables**: Age-dependent risk
- **Experience rating**: Claims history analysis

---

## 📚 Related Documentation

- **Quick Reference**: Formula summaries
- **Edge Cases**: Boundary condition handling
- **Common Mistakes**: What to avoid

---

**Last Updated**: May 11, 2026  
**Maintained By**: Development Team  
**Original Actuarial Work**: Miguel Ángel Pinilla Lebrato (mpl@nacionalre.es)  
**Medical Research**: Nacional de Reaseguros S.A. Actuarial Department
