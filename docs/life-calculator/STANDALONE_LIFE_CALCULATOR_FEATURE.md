# TODO: Standalone Life Calculator in Admin Area

**Created:** 7 May 2026  
**Priority:** Medium  
**Status:** Planning  
**Estimated Effort:** 4-6 hours

---

## 📋 Overview

Create a standalone life insurance calculator page in the admin area (`/calculators/life-calculator`), similar to the existing per-mil calculator. This will allow administrators to test and validate life insurance calculations independently from the application form workflow.

**Key Principle:** **Reuse existing code** - no duplication, single source of truth.

---

## 🎯 Goals

1. ✅ Create standalone calculator UI component
2. ✅ Reuse all existing life calculation services (no code duplication)
3. ✅ Add admin menu navigation
4. ✅ Provide clear, user-friendly interface
5. ✅ Display detailed calculation breakdown

---

## 📂 Current Architecture Analysis

### Existing Per-Mil Calculator Pattern
```
src/app/pages/calculators/
  └── per-mil-calculator/
      ├── per-mil-calculator.component.ts (standalone)
      ├── per-mil-calculator.component.html
      └── per-mil-calculator.component.scss

Routing: /calculators/per-mil-to-per-cent
Menu: Admin only
Service: ActuarialCalculatorService (reused)
```

### Existing Life Calculator Services (TO REUSE)
```
src/app/services/calculator/life/
  ├── life.service.ts ← Main orchestrator
  ├── imc.service.ts
  ├── tobacco.service.ts
  ├── alcohol.service.ts
  ├── cholesterol.service.ts
  ├── blood-pressure.service.ts
  ├── factor.service.ts
  └── insurance.service.ts

src/app/services/calculator/
  ├── calculate-bmi.service.ts
  ├── calculate-tobacco-units.service.ts
  ├── calculate-alcohol-units.service.ts
  └── cholesterol-parse.service.ts
```

---

## 🛠️ Implementation Plan

### **Step 1: Create Component Structure**
**Files to create:**
```
src/app/pages/calculators/life-calculator/
  ├── life-calculator.component.ts
  ├── life-calculator.component.html
  └── life-calculator.component.scss
```

**Component features:**
- Standalone Angular component
- Reactive form for all life calculator inputs
- Real-time validation
- Auto-calculation on input change (debounced)
- Results display with detailed breakdown

---

### **Step 2: Design Input Form**

**Form Fields (matching LifeFields interface):**

```typescript
{
  // Personal Data
  age: number,              // 13-69 years
  gender: 'male' | 'female',
  
  // Body Constitution
  height: number,           // > 120 cm
  weight: number,           // > 32 kg
  // bmi: calculated automatically
  
  // Tobacco Consumption
  smoker: boolean,
  cigarettes: number,       // units/day
  cigars: number,          // units/day
  pipes: number,           // units/day
  asthma: boolean,
  
  // Alcohol Consumption
  alcohol: boolean,
  beers: number,           // units/day
  wines: number,           // units/day
  spirits: number,         // units/day
  
  // Blood Pressure
  systolic: number,        // 75-200 mmHg
  diastolic: number,       // 45-124 mmHg
  
  // Cholesterol
  cholesterol: string      // Range selector
}
```

---

### **Step 3: Reuse Existing Services**

**Inject existing services (NO NEW CODE):**

```typescript
@Component({
  standalone: true,
  selector: 'app-life-calculator',
  // ...
})
export class LifeCalculatorComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    
    // Reuse existing services
    private lifeService: LifeService,
    private calculateBmiService: CalculateBmiService,
    private calculateTobaccoUnitsService: CalculateTobaccoUnitsService,
    private calculateAlcoholUnitsService: CalculateAlcoholUnitsService,
    private cholesterolParseService: CholesterolParseService
  ) {}
  
  calculate(): void {
    // Use lifeService.calculateLifeInsurances() directly
    // No new calculation logic needed!
  }
}
```

---

### **Step 4: Display Results**

**Results to show:**

**Partial Surcharges (Intermediate Values):**
- IMC (BMI) surcharges
- Tobacco surcharges
- Alcohol surcharges
- Cholesterol surcharge
- Blood Pressure surcharge

**Life Factor:**
- Number of risk factors (0-5)

**Final Insurance Surcharges (5 types):**
1. FALLECIMIENTO (Death/Life) - %
2. INVALIDEZ (Disability) - %
3. ACCIDENTES (Accidents) - %
4. ENFERMEDAD_GRAVE (Serious Illness) - %
5. ILT (Income Loss Protection) - %

**Special Messages:**
- Rejection (-1): "Policy rejected due to [factor]"
- Postponement (-2): "Policy postponed due to [factor]"
- Exceeded InMax: "Life insurance exceeds maximum allowed"

---

### **Step 5: Add Routing**

**File:** `src/app/app.routing.module.ts`

```typescript
// Import
import { LifeCalculatorComponent } from './pages/calculators/life-calculator/life-calculator.component';

// Add route (after per-mil calculator)
{
  path: 'calculators/life-calculator',
  component: LifeCalculatorComponent,
  canActivate: [AuthGuard],
  data: { role: 'admin' }
}
```

---

### **Step 6: Add Menu Item**

**File:** `src/app/shared/components/lateral-menu/lateral-menu.component.ts`

**Location:** Admin menu, under "Calculators" group, above "Per Mil to Per Cent Converter"

```typescript
{
  title: 'MENU.Calculators',
  icon: 'calculate',
  type: 'group',
  expanded: true,
  children: [
    {
      title: 'MENU.LifeCalculator',           // NEW
      icon: 'favorite',                        // NEW (or 'health_and_safety')
      link: '/calculators/life-calculator',   // NEW
      type: 'item'                            // NEW
    },
    {
      title: 'MENU.PerMilToPerCentConverter',
      icon: 'percent',
      link: '/calculators/per-mil-to-per-cent',
      type: 'item'
    }
  ]
}
```

---

### **Step 7: Add Translations**

**Files to update:**
- `src/assets/i18n/en.json`
- `src/assets/i18n/es.json`
- `src/assets/i18n/fr.json`
- `src/assets/i18n/de.json`

**Keys to add:**

```json
{
  "MENU": {
    "LifeCalculator": "Life Insurance Calculator",
    // ES: "Calculadora de Vida"
    // FR: "Calculatrice d'Assurance Vie"
    // DE: "Lebensversicherungsrechner"
  },
  
  "LIFE_CALC": {
    "PAGE_TITLE": "Life Insurance Calculator",
    "PAGE_SUBTITLE": "Calculate insurance surcharges based on health factors",
    
    // Personal Data
    "AGE": "Age",
    "GENDER": "Gender",
    "MALE": "Male",
    "FEMALE": "Female",
    
    // Body Constitution
    "HEIGHT": "Height (cm)",
    "WEIGHT": "Weight (kg)",
    "BMI": "BMI",
    "BMI_CALCULATED": "Calculated automatically",
    
    // Tobacco Section
    "TOBACCO_SECTION": "Tobacco Consumption",
    "SMOKER": "Smoker",
    "CIGARETTES": "Cigarettes (per day)",
    "CIGARS": "Cigars (per day)",
    "PIPES": "Pipes (per day)",
    "ASTHMA": "Has Asthma",
    
    // Alcohol Section
    "ALCOHOL_SECTION": "Alcohol Consumption",
    "DRINKS_ALCOHOL": "Drinks Alcohol",
    "BEERS": "Beers (per day)",
    "WINES": "Wines (per day)",
    "SPIRITS": "Spirits (per day)",
    
    // Blood Pressure
    "BLOOD_PRESSURE_SECTION": "Blood Pressure",
    "SYSTOLIC": "Systolic (mmHg)",
    "DIASTOLIC": "Diastolic (mmHg)",
    
    // Cholesterol
    "CHOLESTEROL_SECTION": "Cholesterol",
    "CHOLESTEROL": "Cholesterol Range (mg/dL)",
    
    // Results
    "RESULTS_TITLE": "Calculation Results",
    "PARTIAL_SURCHARGES": "Partial Surcharges",
    "LIFE_FACTOR": "Risk Factor",
    "FINAL_SURCHARGES": "Insurance Surcharges",
    
    // Insurance Types
    "FALLECIMIENTO": "Life Insurance",
    "INVALIDEZ": "Disability Insurance",
    "ACCIDENTES": "Accident Insurance",
    "ENFERMEDAD_GRAVE": "Serious Illness Insurance",
    "ILT": "Income Loss Protection",
    
    // Actions
    "CALCULATE": "Calculate",
    "RESET": "Reset",
    "CLEAR": "Clear",
    
    // Messages
    "REJECTED": "Rejected",
    "POSTPONED": "Postponed",
    "EXCEEDS_MAX": "Exceeds maximum allowed"
  }
}
```

---

## 🎨 UI/UX Considerations

### Layout (similar to per-mil calculator)

```
┌─────────────────────────────────────────────────────┐
│ Life Insurance Calculator                           │
│ Calculate insurance surcharges based on health...  │
├─────────────────┬───────────────────────────────────┤
│                 │                                   │
│  Input Form     │   Results                         │
│  ────────────   │   ────────────────────────        │
│                 │                                   │
│  Personal Data  │   Partial Surcharges              │
│  - Age          │   - IMC: 25%                      │
│  - Gender       │   - Tobacco: 50%                  │
│                 │   - Alcohol: 0%                   │
│  Body           │   - Cholesterol: 25%              │
│  - Height       │   - Blood Pressure: 0%            │
│  - Weight       │                                   │
│  - BMI: 24.5    │   Life Factor: 2                  │
│                 │                                   │
│  Tobacco        │   Insurance Surcharges            │
│  ☐ Smoker       │   - Life: 1.25%                   │
│  - Cigarettes   │   - Disability: 1.25%             │
│  - Cigars       │   - Accidents: 0.88%              │
│  - Pipes        │   - Serious Illness: 1.44%        │
│  ☐ Asthma       │   - ILT: 1.25%                    │
│                 │                                   │
│  Alcohol        │                                   │
│  Blood Pressure │                                   │
│  Cholesterol    │                                   │
│                 │                                   │
│  [Calculate]    │                                   │
│  [Reset]        │                                   │
│                 │                                   │
└─────────────────┴───────────────────────────────────┘
```

### Color Coding (reuse from existing)
- **Green**: Normal values
- **Blue**: Attention values  
- **Red**: Critical values
- **Yellow**: Warnings

### Validation Messages
- Real-time field validation
- Show BMI classification (underweight, normal, overweight, etc.)
- Blood pressure color indicators
- Clear error messages

---

## 📦 Dependencies & Imports

**Angular Modules:**
```typescript
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
```

**No new dependencies needed** - everything already exists!

---

## ✅ Testing Checklist

### Functional Testing
- [ ] Form validation works correctly
- [ ] BMI calculates automatically
- [ ] Tobacco units calculate correctly
- [ ] Alcohol units calculate correctly
- [ ] Blood pressure validation works
- [ ] Cholesterol ranges work
- [ ] All 5 insurance types calculate correctly
- [ ] Rejection cases display properly (-1)
- [ ] Postponement cases display properly (-2)
- [ ] InMax limit validation works
- [ ] Reset button clears form
- [ ] Auto-calculation on input change works

### UI/UX Testing
- [ ] Responsive layout works (desktop, tablet, mobile)
- [ ] Color coding displays correctly
- [ ] Validation messages appear
- [ ] Results update in real-time
- [ ] Loading states work
- [ ] Error states display properly

### Integration Testing
- [ ] Menu link navigates correctly
- [ ] Auth guard protects route (admin only)
- [ ] All services inject correctly
- [ ] No console errors
- [ ] Translations load in all languages

### Edge Cases
- [ ] Minimum age (13)
- [ ] Maximum age (69)
- [ ] Minimum height (120 cm)
- [ ] Minimum weight (32 kg)
- [ ] Very high BMI (> 46)
- [ ] Very low BMI (< 16)
- [ ] Maximum blood pressure values
- [ ] All cholesterol ranges
- [ ] Zero tobacco/alcohol consumption
- [ ] Multiple risk factors (lifeFactor = 5)

---

## 🚀 Deployment Steps

1. Create component files
2. Implement form logic
3. Wire up existing services
4. Add routing
5. Add menu item
6. Add translations
7. Test thoroughly
8. Code review
9. Merge to development
10. QA testing
11. Deploy to staging
12. Production deployment

---

## 📝 Documentation Updates Needed

**Files to update:**
1. `README.md` - Add calculator to features list
2. `docs/readme/admin-tools.md` - Document calculator usage (if exists)
3. `docs/DONE/features/` - Move this TODO after completion

**New documentation to create:**
- `docs/readme/standalone-life-calculator.md` - User guide

---

## 🔄 Code Reuse Summary

### ✅ Reusing (No Duplication)
- All calculation services (`life.service.ts`, etc.)
- BMI calculation service
- Tobacco units calculation
- Alcohol units calculation
- Cholesterol parsing
- Validation logic
- Type definitions
- Existing styles/themes

### ⚠️ New Code Required
- Component wrapper only
- Form structure
- Results display template
- Component-specific styles
- Routing entry
- Menu entry
- Translations

---

## 📊 Success Metrics

- ✅ Zero code duplication (single source of truth maintained)
- ✅ All calculations match main application form
- ✅ Admin can test calculations independently
- ✅ Clear, professional UI
- ✅ Fast, responsive experience
- ✅ Full test coverage

---

## 🎯 Next Steps

1. **Review this TODO** - Validate approach and requirements
2. **Create component** - Follow per-mil calculator pattern
3. **Wire services** - Inject and use existing services
4. **Add navigation** - Menu and routing
5. **Translate** - Add i18n keys
6. **Test** - Comprehensive testing
7. **Document** - Update docs
8. **Deploy** - Production release

---

## 📎 Related Files

**Reference Implementation:**
- `src/app/pages/calculators/per-mil-calculator/` - Pattern to follow

**Services to Reuse:**
- `src/app/services/calculator/life/life.service.ts`
- `src/app/services/calculator/life/*.service.ts`
- `src/app/services/calculator/calculate-*.service.ts`

**Types:**
- `src/app/types/lifeFields.ts`
- `src/app/types/lifePartialSurcharges.ts`
- `src/app/types/lifeFactor.ts`
- `src/database/types/insurance.ts`
- `src/database/types/health-form.interface.ts`

**Documentation:**
- `docs/readme/healthFormLife.md` - Calculation logic reference

---

## ⚠️ Important Notes

1. **Do NOT duplicate calculation logic** - Always import from existing services
2. **Match validation rules** - Use same rules as main form
3. **Consistent UI** - Follow Material Design and app theme
4. **Admin only** - Protect route with AuthGuard
5. **Multi-language** - Support all 4 languages (EN, ES, FR, DE)
6. **Accessibility** - Follow WCAG guidelines
7. **Performance** - Debounce auto-calculation (300ms)

---

**Status:** Ready for implementation  
**Assigned to:** TBD  
**Expected completion:** TBD
