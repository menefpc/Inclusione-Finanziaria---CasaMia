function fmt(v) {
  return v.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function monthlyPayment(loan, annualRatePct, n) {
  const r = annualRatePct / 100 / 12;
  if (r <= 0 || n <= 0 || loan <= 0) return 0;
  return loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

let rateType = 'fisso';

function setRateType(type) {
  rateType = type;
  document.getElementById('rateFixedBtn').classList.toggle('active', type === 'fisso');
  document.getElementById('rateVariableBtn').classList.toggle('active', type === 'variabile');
  calcRate();
}

function calcRate() {
  const house = parseFloat(document.getElementById('houseValue').value) || 0;
  const down = parseFloat(document.getElementById('downPayment').value) || 0;
  const annualRate = parseFloat(document.getElementById('rate').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;

  const loan = house - down;
  const ltv = house > 0 ? (loan / house) * 100 : 0;
  const n = years * 12;

  const monthly = monthlyPayment(loan, annualRate, n);
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - loan;

  document.getElementById('rateLabel').textContent = rateType === 'variabile'
    ? 'Rata mensile stimata (al tasso attuale)'
    : 'Rata mensile stimata';
  document.getElementById('monthlyRate').textContent = monthly > 0 ? fmt(monthly) : '—';
  document.getElementById('loanAmount').textContent = loan > 0 ? fmt(loan) : '—';
  document.getElementById('ltvValue').textContent = ltv > 0 ? ltv.toFixed(1) + '%' : '—';
  document.getElementById('totalInterest').textContent = totalInterest > 0 ? fmt(totalInterest) : '—';
  document.getElementById('totalPaid').textContent = totalPaid > 0 ? fmt(totalPaid) : '—';

  const warning = document.getElementById('ltvWarning');
  warning.style.display = ltv > 80 ? 'block' : 'none';

  const income = parseFloat(document.getElementById('income').value) || 0;
  const sustainabilityBadge = document.getElementById('sustainabilityBadge');
  const assessment = monthly > 0 ? assessSustainability(monthly, income) : null;
  if (assessment) {
    sustainabilityBadge.style.display = 'flex';
    sustainabilityBadge.className = `sustainability-badge sustainability-${assessment.level}`;
    sustainabilityBadge.innerHTML =
      `<span class="sustainability-emoji">${assessment.emoji}</span>` +
      `<span>Sostenibilità: <strong>${assessment.label}</strong> — la rata è il ${assessment.pct.toFixed(0)}% del tuo reddito netto</span>`;
  } else {
    sustainabilityBadge.style.display = 'none';
  }

  const scenario = document.getElementById('rateScenario');
  if (rateType === 'variabile' && loan > 0 && n > 0) {
    scenario.style.display = 'block';
    document.getElementById('scenarioDown').textContent = fmt(monthlyPayment(loan, Math.max(annualRate - 1, 0), n));
    document.getElementById('scenarioCurrent').textContent = fmt(monthly);
    document.getElementById('scenarioUp1').textContent = fmt(monthlyPayment(loan, annualRate + 1, n));
    document.getElementById('scenarioUp2').textContent = fmt(monthlyPayment(loan, annualRate + 2, n));
  } else {
    scenario.style.display = 'none';
  }
}

function calcCosts() {
  const house = parseFloat(document.getElementById('houseValue').value) || 0;
  const down = parseFloat(document.getElementById('downPayment').value) || 0;
  const agencyPct = parseFloat(document.getElementById('agencyPct').value) || 0;
  const notary = parseFloat(document.getElementById('notaryFee').value) || 0;
  const registryPct = parseFloat(document.getElementById('registryPct').value) || 0;
  const survey = parseFloat(document.getElementById('surveyFee').value) || 0;
  const underwriting = parseFloat(document.getElementById('underwritingFee').value) || 0;
  const insurance = parseFloat(document.getElementById('insuranceFee').value) || 0;

  const agency = house * (agencyPct / 100);
  const registry = house * (registryPct / 100);
  const total = down + agency + notary + registry + survey + underwriting + insurance;

  document.getElementById('costDown').textContent = fmt(down);
  document.getElementById('costAgency').textContent = fmt(agency);
  document.getElementById('costNotary').textContent = fmt(notary);
  document.getElementById('costRegistry').textContent = fmt(registry);
  document.getElementById('costSurvey').textContent = fmt(survey);
  document.getElementById('costUnderwriting').textContent = fmt(underwriting);
  document.getElementById('costInsurance').textContent = fmt(insurance);
  document.getElementById('costTotal').textContent = fmt(total);
}

document.addEventListener('DOMContentLoaded', () => {
  calcRate();
  calcCosts();
});
