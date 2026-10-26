/**
 * STERLING & CO. TAX ADVISORS - INTERACTIVE TAX CALCULATOR WIDGET
 * Provides sophisticated multi-regime income tax estimation,
 * deduction calculations, and potential tax savings with visual comparison.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTaxCalculator();
});

function initTaxCalculator() {
  const calcContainer = document.getElementById('sterling-tax-calculator');
  if (!calcContainer) return;

  // State
  let clientType = 'individual'; // 'individual' | 'joint' | 'corporate'
  let grossIncome = 250000;
  let deductions = 24000;
  let useRetirement = true;
  let useCharity = false;
  let useCapitalGains = false;
  let useForeignCredits = false;

  // DOM Elements
  const typeButtons = calcContainer.querySelectorAll('.calc-type-btn');
  const incomeSlider = calcContainer.querySelector('#calc-income-slider');
  const incomeDisplay = calcContainer.querySelector('#calc-income-val');
  const deductionsInput = calcContainer.querySelector('#calc-deductions-input');
  
  const chkRetirement = calcContainer.querySelector('#chk-retirement');
  const chkCharity = calcContainer.querySelector('#chk-charity');
  const chkCapGains = calcContainer.querySelector('#chk-cap-gains');
  const chkForeign = calcContainer.querySelector('#chk-foreign');

  // Outputs
  const savingsDisplay = calcContainer.querySelector('#calc-savings-amount');
  const barStandard = calcContainer.querySelector('#calc-bar-standard');
  const barOptimized = calcContainer.querySelector('#calc-bar-optimized');
  const valStandard = calcContainer.querySelector('#calc-val-standard');
  const valOptimized = calcContainer.querySelector('#calc-val-optimized');
  const effRateDisplay = calcContainer.querySelector('#calc-eff-rate');
  const bookWithSavingsBtn = calcContainer.querySelector('#btn-book-with-savings');

  // 1. Client Type Switcher
  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      clientType = btn.getAttribute('data-type');

      // Adjust defaults based on client type
      if (clientType === 'individual') {
        incomeSlider.min = '50000';
        incomeSlider.max = '1500000';
        incomeSlider.step = '10000';
        if (grossIncome < 50000 || grossIncome > 1500000) grossIncome = 250000;
      } else if (clientType === 'joint') {
        incomeSlider.min = '100000';
        incomeSlider.max = '3000000';
        incomeSlider.step = '25000';
        if (grossIncome < 100000) grossIncome = 450000;
      } else if (clientType === 'corporate') {
        incomeSlider.min = '250000';
        incomeSlider.max = '10000000';
        incomeSlider.step = '50000';
        grossIncome = Math.max(grossIncome, 750000);
      }
      incomeSlider.value = grossIncome;
      updateCalculation();
    });
  });

  // 2. Income Slider & Display Sync
  if (incomeSlider) {
    incomeSlider.addEventListener('input', (e) => {
      grossIncome = parseFloat(e.target.value);
      updateCalculation();
    });
  }

  // 3. Deductions Input
  if (deductionsInput) {
    deductionsInput.addEventListener('input', (e) => {
      deductions = parseFloat(e.target.value) || 0;
      updateCalculation();
    });
  }

  // 4. Optimization Checkboxes
  const checkInputs = [chkRetirement, chkCharity, chkCapGains, chkForeign];
  checkInputs.forEach((chk) => {
    if (chk) {
      chk.addEventListener('change', () => {
        useRetirement = chkRetirement ? chkRetirement.checked : false;
        useCharity = chkCharity ? chkCharity.checked : false;
        useCapitalGains = chkCapGains ? chkCapGains.checked : false;
        useForeignCredits = chkForeign ? chkForeign.checked : false;
        updateCalculation();
      });
    }
  });

  // Core Math Calculation
  function updateCalculation() {
    // Format Income Display
    if (incomeDisplay) {
      incomeDisplay.textContent = `$${grossIncome.toLocaleString()}`;
    }

    // Baseline Tax Rates (Progressive Model)
    let standardTax = 0;
    let optimizedTax = 0;

    if (clientType === 'individual') {
      // Standard Brackets
      if (grossIncome <= 44725) {
        standardTax = grossIncome * 0.12;
      } else if (grossIncome <= 95375) {
        standardTax = 5367 + (grossIncome - 44725) * 0.22;
      } else if (grossIncome <= 182100) {
        standardTax = 16510 + (grossIncome - 95375) * 0.24;
      } else if (grossIncome <= 231250) {
        standardTax = 37324 + (grossIncome - 182100) * 0.32;
      } else if (grossIncome <= 578125) {
        standardTax = 53052 + (grossIncome - 231250) * 0.35;
      } else {
        standardTax = 174458 + (grossIncome - 578125) * 0.37;
      }

      // Sterling Strategic Optimization
      let strategicDeductions = deductions;
      if (useRetirement) strategicDeductions += 23000; // max pre-tax retirement
      if (useCharity) strategicDeductions += grossIncome * 0.05; // donor advised fund
      let optimizedTaxable = Math.max(0, grossIncome - strategicDeductions);

      // Structure discount via tax-loss harvesting and estate trust routing
      let effectiveRate = (standardTax / grossIncome) * 0.72; // ~28% structural optimization
      if (useCapitalGains) effectiveRate *= 0.92;
      if (useForeignCredits) effectiveRate *= 0.90;

      optimizedTax = optimizedTaxable * effectiveRate;
    } else if (clientType === 'joint') {
      // Married Filing Jointly Brackets
      if (grossIncome <= 89450) {
        standardTax = grossIncome * 0.12;
      } else if (grossIncome <= 190750) {
        standardTax = 10734 + (grossIncome - 89450) * 0.22;
      } else if (grossIncome <= 364200) {
        standardTax = 33020 + (grossIncome - 190750) * 0.24;
      } else {
        standardTax = 74648 + (grossIncome - 364200) * 0.35;
      }

      let strategicDeductions = deductions * 1.5;
      if (useRetirement) strategicDeductions += 46000;
      if (useCharity) strategicDeductions += grossIncome * 0.07;
      let optimizedTaxable = Math.max(0, grossIncome - strategicDeductions);

      let effectiveRate = (standardTax / grossIncome) * 0.69;
      if (useCapitalGains) effectiveRate *= 0.90;
      if (useForeignCredits) effectiveRate *= 0.88;

      optimizedTax = optimizedTaxable * effectiveRate;
    } else {
      // Corporate Entity (21% Federal + State + Dividend layer ~32% baseline)
      standardTax = grossIncome * 0.29;
      let corpSavingsFactor = 0.64; // R&D tax credits, cross-border pass-through, depreciation
      if (useForeignCredits) corpSavingsFactor -= 0.08;
      if (useCharity) corpSavingsFactor -= 0.04;

      optimizedTax = (grossIncome - deductions * 2) * (0.29 * corpSavingsFactor);
    }

    // Ensure realistic bounds
    if (optimizedTax < standardTax * 0.52) optimizedTax = standardTax * 0.52;
    if (optimizedTax > standardTax) optimizedTax = standardTax * 0.9;

    const netSavings = Math.round(standardTax - optimizedTax);
    const effectiveRate = ((optimizedTax / grossIncome) * 100).toFixed(1);

    // Update UI
    if (savingsDisplay) {
      savingsDisplay.textContent = `$${netSavings.toLocaleString()}`;
    }
    if (valStandard) {
      valStandard.textContent = `$${Math.round(standardTax).toLocaleString()}`;
    }
    if (valOptimized) {
      valOptimized.textContent = `$${Math.round(optimizedTax).toLocaleString()}`;
    }
    if (effRateDisplay) {
      effRateDisplay.textContent = `${effectiveRate}%`;
    }

    // Update Progress Bars
    if (barStandard && barOptimized) {
      barStandard.style.width = '100%';
      const optimizedPercentage = Math.round((optimizedTax / standardTax) * 100);
      barOptimized.style.width = `${optimizedPercentage}%`;
    }

    // Update consultation booking link with preloaded savings
    if (bookWithSavingsBtn) {
      bookWithSavingsBtn.href = `contact.html?type=${clientType}&savings=${netSavings}&income=${grossIncome}#book`;
    }
  }

  // Initial Run
  updateCalculation();
}
