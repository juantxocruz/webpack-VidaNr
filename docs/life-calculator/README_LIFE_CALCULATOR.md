# Life Calculator Documentation Index

**Complete documentation suite for the VidaNr Life Insurance Calculator**

---

## 📚 Documentation Quick Access

### 🚀 **Start Here**
New to the Life Calculator? Start with these documents in order:

1. **[Quick Reference Guide](LIFE_CALCULATOR_QUICK_REFERENCE.md)** ⭐ **START HERE**
   - Fast lookup for formulas and special rules
   - Common scenarios and examples
   - 5-minute read for quick answers

2. **[Common Mistakes Guide](LIFE_CALCULATOR_COMMON_MISTAKES.md)** 
   - Top 10 most common errors
   - Real production issues and solutions
   - Checklist before deployment

3. **[Edge Cases & Troubleshooting](LIFE_CALCULATOR_EDGE_CASES.md)**
   - Boundary conditions (age 13, 69, etc.)
   - Special value handling
   - Debugging guide

---

## 📖 Complete Documentation

### **Core Documentation**

#### **[Life Calculator Quick Reference](LIFE_CALCULATOR_QUICK_REFERENCE.md)**
*Essential formulas and rules at a glance*

**Contents**:
- Required inputs
- Special formula rules (IMC halved, alcohol threshold, etc.)
- lifeFactor (NAGRA) calculation
- Final insurance formulas
- Rejection logic (inMax)
- Service architecture
- Common scenarios

**When to use**: Quick lookup during development

---

#### **[Common Mistakes Guide](LIFE_CALCULATOR_COMMON_MISTAKES.md)**
*Learn from others' errors*

**Contents**:
- Top 10 most common mistakes
- Calculation sequence errors
- Display & formatting issues
- Testing mistakes
- Type safety issues
- Production issue examples
- Pre-deployment checklist

**When to use**: Code review, debugging, learning best practices

---

#### **[Edge Cases & Troubleshooting](LIFE_CALCULATOR_EDGE_CASES.md)**
*Comprehensive guide to boundary conditions*

**Contents**:
- Age boundaries (13, 69)
- BMI edge cases (16, 28, 46)
- Blood pressure compensation
- Cholesterol thresholds
- Alcohol & tobacco limits
- Special value conflicts
- Rounding behavior
- Troubleshooting guide
- Test suite template

**When to use**: Handling unusual cases, writing tests, debugging

---

#### **[Actuarial Age Calculation](ACTUARIAL_AGE_CALCULATION.md)** 🆕
*Age Nearest Birthday methodology*

**Contents**:
- What is actuarial age vs regular age
- The bug that was fixed (May 2026)
- Correct implementation guide
- Real-world calculation examples
- Testing edge cases
- Common implementation mistakes
- JavaScript & TypeScript code examples

**When to use**: Understanding age calculations, implementing age service, debugging age-related issues

---

### **Original Documentation**

#### **[VidaNr README](../vidaNr/20220119 VidaNr/webpack-vidaNr/README.md)**
*Original comprehensive guide from 2022*

**Contents**:
- Detailed calculation steps
- All validation rules
- Variable explanations
- Table structures
- Example PDFs
- Original JavaScript implementation

**When to use**: Deep dive into calculation logic, understanding original design

---

#### **[Health Form Life Documentation](../readme/healthFormLife.md)**
*TypeScript implementation guide*

**Contents**:
- Service-based architecture
- TypeScript-specific implementation
- Angular integration
- Modern best practices

**When to use**: Understanding TypeScript migration, service architecture

---

## 🎯 Documentation by Task

### **I want to...**

#### **...understand the basics**
→ Start with **[Quick Reference Guide](LIFE_CALCULATOR_QUICK_REFERENCE.md)**

#### **...debug a calculation issue**
→ Check **[Troubleshooting](LIFE_CALCULATOR_EDGE_CASES.md#troubleshooting)** section

#### **...avoid common errors**
→ Read **[Common Mistakes](LIFE_CALCULATOR_COMMON_MISTAKES.md)**

#### **...implement a new feature**
→ Review **[Quick Reference](LIFE_CALCULATOR_QUICK_REFERENCE.md)** + **[Original README](../vidaNr/20220119 VidaNr/webpack-vidaNr/README.md)**

#### **...write tests**
→ Use **[Edge Cases test template](LIFE_CALCULATOR_EDGE_CASES.md#testing-edge-cases)**

#### **...verify formulas**
→ Compare with **[Original FoxPro comments](LIFE_CALCULATOR_QUICK_REFERENCE.md#final-insurance-formulas)**

#### **...handle boundary values**
→ Consult **[Edge Cases](LIFE_CALCULATOR_EDGE_CASES.md)**

#### **...understand actuarial age vs regular age**
→ Read **[Actuarial Age Calculation](ACTUARIAL_AGE_CALCULATION.md)**

#### **...fix age calculation issues**
→ See **[Actuarial Age examples](ACTUARIAL_AGE_CALCULATION.md#real-world-examples)**

---

## 🔑 Key Concepts Summary

### **Special Formula Rules**
1. **Accidents**: IMC is **halved** (÷ 2)
2. **Serious Illness**: Tobacco is **multiplied by 1.5** and uses **1.2 multiplier** (not 1.1)
3. **Disability/Accident**: Alcohol >75 becomes **reject (-1)**
4. **ILT**: Uses **separate tables** for IMC, Tobacco, Alcohol

### **Special Values**
- **-1**: Rechazar (Reject)
- **-2**: Aplazar (Defer)
- **999**: Rechazar (ILT-specific)
- **0**: Normal (no surcharge)

### **Age Types**
- **Regular age**: Calendar age for validation
- **Actuarial age**: Age at nearest birthday (for BMI, BP, Cholesterol)

### **lifeFactor (NAGRA)**
- Sum of active risk factors (IMC, Tobacco, Alcohol, Cholesterol, Blood Pressure)
- Range: 0-5
- Applies exponential multiplier: 1.1^(lifeFactor-1) for most insurances

---

## 📊 Calculation Flow

```
┌─────────────────┐
│  Input Fields   │
│ (Age, BMI, BP,  │
│  Chol, etc.)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Validation    │
│  (Age 13-69,    │
│   BP comp, etc) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Partial         │
│ Surcharges      │
│ (IMC, Tobacco,  │
│  Alcohol, etc.) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  lifeFactor     │
│  Calculation    │
│  (0-5)          │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Final Insurance │
│ Calculations    │
│ (×multiplier)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  inMax Check    │
│ (Life ≤ 200/300)│
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Results      │
│  or Rejection   │
└─────────────────┘
```

---

## 🧪 Testing Resources

### **Test Data Sets**

#### **Normal Case (All Normal)**
```typescript
{
  age: 25,
  gender: 'male',
  weight: 70,
  height: 175,
  bmi: 22.86,
  cholesterol: '<240',
  systolic: 120,
  diastolic: 80,
  tobacco: 0,
  alcohol: 0
}
// Expected: All 0% (Normal)
```

#### **High BMI Only**
```typescript
{
  age: 26,
  gender: 'male',
  weight: 80,
  height: 165,
  bmi: 29.38,
  cholesterol: '<240',
  systolic: 120,
  diastolic: 80,
  tobacco: 0,
  alcohol: 0
}
// Expected: Life +25%, Accident +12.5%, lifeFactor = 1
```

#### **Rejection Case (Alcohol >75)**
```typescript
{
  age: 40,
  gender: 'male',
  wines: 7,  // Results in alcohol > 75
  // ... other normal values
}
// Expected: Disability = -100% (reject), Accident = -100% (reject)
```

---

## 🛠️ Development Tools

### **Service Architecture**
```
src/app/services/calculator/life/
├── life.service.ts              # Main orchestrator
├── insurance.service.ts         # Final calculations
├── factor.service.ts            # lifeFactor (NAGRA)
├── imc.service.ts              # BMI lookup
├── tobacco.service.ts          # Tobacco lookup
├── alcohol.service.ts          # Alcohol lookup
├── cholesterol.service.ts      # Cholesterol lookup
└── blood-pressure.service.ts   # BP matrix lookup
```

### **Key Type Definitions**
```typescript
interface LifePartialSurcharges {
  imc: { FALLECIMIENTO: number; ILT: number };
  tobacco: { FALLECIMIENTO: number; ILT: number };
  alcohol: { FALLECIMIENTO: number; ILT: number };
  cholesterol: number;
  bloodPressure: number;
}

interface LifeFactor {
  life: number; // 0-5
}

interface Insurance {
  FALLECIMIENTO: number;           // Life
  INVALIDEZ: number;                // Disability
  FALLECIMIENTO_ACCIDENTAL: number; // Accident
  ENFERMEDAD_GRAVE: number;         // Serious Illness
  ILT: number;                      // Temporary Disability
}
```

---

## 📝 Contributing to Documentation

### **When to Update Documentation**
- Formula changes
- New edge cases discovered
- Production issues identified
- User feedback

### **Documentation Standards**
- ✅ Include examples
- ✅ Explain WHY, not just WHAT
- ✅ Add test cases for edge cases
- ✅ Keep original FoxPro comments
- ✅ Update all affected documents

---

## 🔗 External References

### **Mortality Tables**
- [PASEM 2010](https://www.boe.es/diario_boe/txt.php?id=BOE-A-2012-9776)
- [GKMF95](https://www.unespa.es/main-files/uploads/2017/06/Tablas-mortalidad-PASEM2010.pdf)

### **Life Expectancy Methodology**
- [INE - Multiple Decrements](https://www.ine.es/daco/daco42/discapa/meto_evld.pdf)

### **Biometric Tables**
- [DGSFP - Sectoral Tables](http://www.dgsfp.mineco.es/es/Regulacion/DocumentosRegulacion/)

---

## 📞 Support & Contacts

### **Development Team**
- **Miguel Ángel Pinilla Lebrato** - Risk Selection Specialist  
  mpl@nacionalre.es

- **Juantxo Cruz** - Web Development  
  jcruz16@gmail.com  
  [@juantxocruz](https://twitter.com/juantxocruz)

### **Company**
- **Nacional de Reaseguros S.A.**
- [DaVinci Platform](http://davinci.nacionalre.es/)

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | 2017-04-10 | Gender removed from BP tables (FoxPro) |
| 4.0 | 2022-01 | Webpack VidaNr implementation |
| 5.0 | 2026-05 | TypeScript/Angular migration |

---

## 📜 License

```
Copyright © 2022-2026 Nacional de Reaseguros S.A.
All rights reserved.
```

---

**Last Updated**: May 11, 2026  
**Documentation Version**: 1.0  
**Calculator Version**: 5.0 (TypeScript)
