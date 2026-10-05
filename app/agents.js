/* ============================================================
   CasaMia — Orchestratore Multi-Agente (routing simulato)
   Implementa la logica descritta in agents/*.md:
   - CLAUDE.md          -> orchestrazione / routing
   - terminology-agent  -> glossario
   - calculator-agent   -> calcoli mutuo
   - document-agent     -> checklist documenti
   - support-agent      -> casi difficili / FAQ
   Nessuna chiamata API: le risposte sono generate da una
   logica deterministica che replica le decisioni documentate
   negli agent file, non da un modello generativo.
   ============================================================ */

const AGENT_LABELS = {
  main: '🏠 CasaMia',
  terminology: '📖 Agente Glossario',
  calculator: '🧮 Agente Calcolatore',
  documents: '📋 Agente Documenti',
  support: '🆘 Agente Supporto'
};

/* ---------- STATO CONVERSAZIONE ---------- */
const conversationState = {
  pendingAgent: null,      // 'documents' | 'calculator' | null
  calcSlots: {},           // valori raccolti per il calcolatore
  docsProfile: null
};

/* ---------- AGENTE GLOSSARIO ---------- */
const glossaryDB = {
  taeg: {
    term: 'TAEG',
    def: 'Il costo totale reale del mutuo espresso in percentuale annua: include tasso d\'interesse, commissioni, assicurazioni obbligatorie e tutte le spese.',
    example: 'Un mutuo con TAN 3,5% può avere TAEG 4,1% una volta aggiunte le spese. Su €200.000 in 25 anni, 0,6 punti in più valgono circa €15.000.',
    relevance: 'Confronta sempre il TAEG, non il TAN: due mutui con lo stesso TAN possono costare in modo molto diverso.'
  },
  tan: {
    term: 'TAN',
    def: 'Tasso Annuo Nominale: è solo il tasso d\'interesse "puro", senza considerare le commissioni.',
    example: 'Se il TAN è 3,5% ma il TAEG è 4,1%, la differenza (0,6%) sono i costi accessori che il TAN non mostra.',
    relevance: 'Non basarti solo sul TAN per confrontare offerte diverse: usa il TAEG.'
  },
  spread: {
    term: 'Spread',
    def: 'Il guadagno fisso che la banca aggiunge al tasso base di mercato (Euribor o IRS).',
    example: 'Euribor 3,5% + spread 1,2% = tasso finale 4,7%. Se l\'Euribor sale a 3,8%, tu paghi 5%.',
    relevance: 'Nei mutui a tasso variabile, lo spread è l\'unica parte negoziabile — il tasso base è uguale per tutti.'
  },
  euribor: {
    term: 'Euribor',
    def: 'Il tasso interbancario europeo di riferimento, usato nei mutui a tasso variabile.',
    example: 'Se l\'Euribor sale dall\'1% al 2%, la rata di un mutuo variabile aumenta di conseguenza.',
    relevance: 'Con un mutuo variabile, la tua rata segue l\'andamento dell\'Euribor nel tempo.'
  },
  irs: {
    term: 'IRS',
    def: 'Interest Rate Swap: il tasso di riferimento per i mutui a tasso fisso, non cambia nel tempo.',
    example: 'Un mutuo fisso firmato con IRS al 2,8% manterrà quella base per tutta la durata del prestito.',
    relevance: 'A differenza dell\'Euribor, l\'IRS "blocca" il costo di riferimento del tuo mutuo fisso.'
  },
  ltv: {
    term: 'LTV (Loan-to-Value)',
    def: 'Il rapporto tra l\'importo del mutuo richiesto e il valore dell\'immobile.',
    example: 'Casa da €200.000, anticipo €40.000, mutuo €160.000 → LTV = 160/200 = 80%.',
    relevance: 'Sotto l\'80% ottieni tassi migliori; sopra, alcune banche chiedono garanzie aggiuntive.'
  },
  ammortamento: {
    term: 'Ammortamento',
    def: 'Il piano di rimborso del mutuo nel tempo: ogni rata include una quota di capitale e una di interessi.',
    example: 'Nei primi anni la rata è composta soprattutto da interessi; verso la fine, soprattutto da capitale.',
    relevance: 'Capire l\'ammortamento ti aiuta a valutare se conviene estinguere il mutuo in anticipo.'
  },
  caparra: {
    term: 'Caparra',
    def: 'Una somma versata al venditore al momento del compromesso come "pegno" dell\'accordo.',
    example: 'Se ti ritiri tu, la perdi. Se si ritira il venditore, deve restituirti il doppio.',
    relevance: 'Inserisci sempre nel compromesso la clausola sospensiva legata all\'ottenimento del mutuo.'
  },
  perizia: {
    term: 'Perizia',
    def: 'La valutazione ufficiale del valore della casa fatta da un tecnico incaricato dalla banca.',
    example: 'Se compri a €210.000 ma la perizia valuta la casa €195.000, la banca presta l\'80% di €195.000, non di €210.000.',
    relevance: 'Determina l\'importo massimo che la banca ti presta, indipendentemente dal prezzo pattuito.'
  },
  istruttoria: {
    term: 'Istruttoria',
    def: 'L\'analisi che la banca fa su di te: reddito, storia creditizia, stabilità lavorativa.',
    example: 'Durante l\'istruttoria la banca può chiederti documenti aggiuntivi su reddito o conto corrente.',
    relevance: 'Rispondere velocemente alle richieste della banca in questa fase accorcia i tempi.'
  },
  rogito: {
    term: 'Rogito',
    def: 'Il contratto definitivo di compravendita, firmato dal notaio insieme all\'atto di mutuo.',
    example: 'Il giorno del rogito la banca trasferisce i fondi al venditore e tu ricevi le chiavi.',
    relevance: 'È l\'ultimo passo: da qui diventi ufficialmente proprietario di casa.'
  },
  crif: {
    term: 'CRIF',
    def: 'Una banca dati che raccoglie la storia creditizia degli italiani (mutui, prestiti, ritardi nei pagamenti).',
    example: 'Se hai saltato rate di un prestito 2 anni fa, la banca lo vede nel tuo report CRIF.',
    relevance: 'Puoi richiedere il tuo report gratuitamente su crif.it prima di andare in banca, per evitare sorprese.'
  },
  delibera: {
    term: 'Delibera',
    def: 'Il documento con cui la banca comunica l\'approvazione (o il rifiuto) del tuo mutuo.',
    example: 'La delibera ha validità limitata, di solito 3-6 mesi: controlla sempre importo, tasso e durata.',
    relevance: 'È il via libera definitivo prima di procedere al rogito.'
  },
  compromesso: {
    term: 'Compromesso',
    def: 'Il contratto preliminare di vendita firmato tra te e il venditore, prima del rogito.',
    example: 'Di solito prevede il versamento di una caparra del 10-20% del prezzo.',
    relevance: 'Inserisci sempre la clausola "subordinato all\'ottenimento del mutuo" per tutelarti.'
  }
};

const glossaryPatterns = [
  { re: /\btaeg\b/i, key: 'taeg' },
  { re: /\btan\b/i, key: 'tan' },
  { re: /\bspread\b/i, key: 'spread' },
  { re: /\beuribor\b/i, key: 'euribor' },
  { re: /\birs\b/i, key: 'irs' },
  { re: /\bltv\b|loan.to.value/i, key: 'ltv' },
  { re: /ammortamento/i, key: 'ammortamento' },
  { re: /caparra/i, key: 'caparra' },
  { re: /perizia/i, key: 'perizia' },
  { re: /istruttoria/i, key: 'istruttoria' },
  { re: /rogito/i, key: 'rogito' },
  { re: /\bcrif\b/i, key: 'crif' },
  { re: /delibera/i, key: 'delibera' },
  { re: /compromesso/i, key: 'compromesso' }
];

function terminologyAgent(text) {
  const match = glossaryPatterns.find(p => p.re.test(text));
  if (!match) return null;
  const g = glossaryDB[match.key];
  return `<strong>${g.term}</strong><br><br>${g.def}<br><br>` +
         `<em>Esempio pratico:</em> ${g.example}<br><br>` +
         `<em>Perché ti interessa:</em> ${g.relevance}`;
}

/* ---------- AGENTE CALCOLATORE ---------- */
function parseFlexibleNumber(str) {
  if (str.includes(',') && str.includes('.')) {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  }
  if (str.includes(',')) {
    return parseFloat(str.replace(',', '.'));
  }
  if (str.includes('.')) {
    const parts = str.split('.');
    const lastPart = parts[parts.length - 1];
    // Più di un punto (es. "1.200.000") o ultimo gruppo di 3 cifre (es. "200.000")
    // indicano un separatore delle migliaia; altrimenti è un decimale (es. "3.5").
    if (parts.length > 2 || lastPart.length === 3) {
      return parseFloat(str.replace(/\./g, ''));
    }
    return parseFloat(str);
  }
  return parseFloat(str);
}

function extractNumbers(text) {
  const nums = (text.match(/[\d.,]+/g) || [])
    .map(parseFlexibleNumber)
    .filter(n => !isNaN(n));
  return nums;
}

function calculatorAgent(text) {
  const triggers = /calcola|quanto pago|rata|mi costa|posso permetter/i;
  if (!triggers.test(text) && conversationState.pendingAgent !== 'calculator') return null;

  conversationState.pendingAgent = 'calculator';
  const slots = conversationState.calcSlots;
  const nums = extractNumbers(text);

  // Prova a riempire gli slot mancanti in ordine: valore, anticipo, tasso, anni
  const order = ['valore', 'anticipo', 'tasso', 'anni'];
  for (const n of nums) {
    const missing = order.find(k => slots[k] === undefined);
    if (missing) slots[missing] = n;
  }

  // Se mancano dati, chiedi il prossimo
  if (slots.valore === undefined) {
    return 'Quanto costa la casa che vuoi comprare (in €)?';
  }
  if (slots.anticipo === undefined) {
    return 'Quanto hai da parte come anticipo (in €)?';
  }
  if (slots.tasso === undefined) {
    return 'Qual è il tasso d\'interesse annuo indicativo (es. 3.5)?';
  }
  if (slots.anni === undefined) {
    return 'In quanti anni vorresti restituire il mutuo?';
  }

  // Tutti gli slot pronti: calcola (formula da skills/mortgage-calculator.md)
  const { valore, anticipo, tasso, anni } = slots;
  const mutuo = valore - anticipo;
  const r = tasso / 100 / 12;
  const n = anni * 12;
  const rata = r > 0
    ? mutuo * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    : mutuo / n;
  const totale = rata * n;
  const interessi = totale - mutuo;
  const ltv = (mutuo / valore) * 100;

  const fmt = v => '€' + v.toLocaleString('it-IT', { maximumFractionDigits: 0 });

  conversationState.pendingAgent = null;
  conversationState.calcSlots = {};

  let ltvNote = ltv > 80
    ? '⚠️ L\'LTV supera l\'80%: molte banche richiedono garanzie aggiuntive.'
    : '✅ LTV entro la soglia dell\'80%, condizione favorevole.';

  return `📊 <strong>Ecco i tuoi numeri</strong><br><br>` +
         `Importo mutuo: ${fmt(mutuo)}<br>` +
         `LTV: ${ltv.toFixed(1)}% ${ltv > 80 ? '⚠️' : '✅'}<br><br>` +
         `💰 <strong>Rata mensile stimata: ${fmt(rata)}</strong><br>` +
         `💸 Totale interessi: ${fmt(interessi)}<br>` +
         `🧾 Totale restituito: ${fmt(totale)}<br><br>${ltvNote}`;
}

/* ---------- AGENTE DOCUMENTI ---------- */
const docChecklists = {
  indeterminato: [
    'Ultime 3 buste paga',
    'Modello CU dell\'ultimo anno',
    'Copia del contratto di lavoro',
    'Estratti conto bancari degli ultimi 3-6 mesi',
    'Documento d\'identità e codice fiscale'
  ],
  determinato: [
    'Ultime 3 buste paga',
    'Modello CU dell\'ultimo anno',
    'Copia del contratto di lavoro (con durata e eventuali rinnovi)',
    'Lettera del datore di lavoro sul rinnovo, se disponibile',
    'Estratti conto bancari degli ultimi 3-6 mesi',
    'Documento d\'identità e codice fiscale'
  ],
  autonomo: [
    'Ultime 2 dichiarazioni dei redditi (730 o Modello Redditi)',
    'F24 pagati negli ultimi 2 anni',
    'Estratti conto bancari degli ultimi 6-12 mesi',
    'Iscrizione alla Camera di Commercio (se applicabile)',
    'Certificato di iscrizione all\'Albo, per liberi professionisti',
    'Documento d\'identità e codice fiscale'
  ]
};

function documentAgent(text) {
  const triggers = /documenti|checklist|cosa serve|cosa devo portare/i;

  if (conversationState.pendingAgent === 'documents') {
    const t = text.toLowerCase();
    let profile = null;
    if (/indeterminat/.test(t) || /^1\b/.test(t)) profile = 'indeterminato';
    else if (/determinat/.test(t) || /^2\b/.test(t)) profile = 'determinato';
    else if (/partita iva|autonom|libero profession/.test(t) || /^3\b/.test(t)) profile = 'autonomo';

    if (!profile) {
      return 'Non ho capito il tipo di contratto — scegli: <strong>1)</strong> tempo indeterminato, <strong>2)</strong> tempo determinato, <strong>3)</strong> partita IVA / libero professionista.';
    }

    conversationState.pendingAgent = null;
    const list = docChecklists[profile].map(d => `✅ ${d}`).join('<br>');
    return `📋 <strong>Checklist documenti per il tuo profilo</strong><br><br>${list}<br><br>` +
           '💡 Crea una cartella sul cloud con tutto scansionato: la banca spesso richiede gli stessi documenti più volte.';
  }

  if (!triggers.test(text)) return null;

  conversationState.pendingAgent = 'documents';
  return 'Per darti la checklist giusta, dimmi il tuo tipo di contratto: <strong>1)</strong> tempo indeterminato, <strong>2)</strong> tempo determinato, <strong>3)</strong> partita IVA / libero professionista.';
}

/* ---------- AGENTE SUPPORTO ---------- */
const supportFAQ = [
  {
    re: /tempo determinato/i,
    answer: 'Con un contratto a tempo determinato è più difficile ma possibile. Alcune banche sono più flessibili se dimostri continuità lavorativa. Puoi anche valutare un garante (fidejussore) o la garanzia statale Consap.'
  },
  {
    re: /partita iva|autonomo|libero profession/i,
    answer: 'Per autonomi e partite IVA, le banche guardano la media degli ultimi 2 anni di reddito dichiarato, non solo l\'ultimo. Conviene rivolgersi a banche specializzate in lavoratori autonomi.'
  },
  {
    re: /rifiutat|negat/i,
    answer: 'Se il mutuo è stato rifiutato, hai il diritto di chiedere i motivi per iscritto. Le opzioni sono: aggiungere un garante, trovare un co-intestatario, ridurre l\'importo richiesto o provare con un\'altra banca (non lo stesso istituto a breve termine).'
  },
  {
    re: /fisso.*variabile|variabile.*fisso/i,
    answer: 'Il tasso fisso dà certezza sulla rata per tutta la durata — ideale se il budget è stretto. Il variabile parte spesso più basso ma può salire — ha senso se pensi di estinguere il mutuo prima o il tuo reddito potrebbe crescere. Regola pratica: se la differenza è sotto 1 punto, scegli il fisso per tranquillità.'
  },
  {
    re: /perizia.*bassa|perizia.*inferiore/i,
    answer: 'Se la perizia valuta la casa meno del prezzo pattuito, la banca presta l\'80% del valore di perizia, non del prezzo. Puoi provare a negoziare il prezzo con il venditore o coprire la differenza con risparmi propri.'
  },
  {
    re: /under *36|agevolazion|consap/i,
    answer: 'Se hai meno di 36 anni e un ISEE sotto 40.000€, puoi accedere all\'esenzione da imposta di registro, ipotecaria e catastale, più la garanzia statale Consap che copre fino all\'80% del mutuo. Verifica sempre le condizioni aggiornate.'
  }
];

function supportAgent(text) {
  const match = supportFAQ.find(f => f.re.test(text));
  return match ? match.answer : null;
}

/* ---------- ORCHESTRATORE PRINCIPALE ---------- */
function routeMessage(text) {
  // Se c'è un agente in attesa di risposta, ha priorità
  if (conversationState.pendingAgent === 'documents') {
    const r = documentAgent(text);
    if (r) return { agent: 'documents', html: r };
  }
  if (conversationState.pendingAgent === 'calculator') {
    const r = calculatorAgent(text);
    if (r) return { agent: 'calculator', html: r };
  }

  const termResult = terminologyAgent(text);
  if (termResult) return { agent: 'terminology', html: termResult };

  const calcResult = calculatorAgent(text);
  if (calcResult) return { agent: 'calculator', html: calcResult };

  const docResult = documentAgent(text);
  if (docResult) return { agent: 'documents', html: docResult };

  const suppResult = supportAgent(text);
  if (suppResult) return { agent: 'support', html: suppResult };

  return {
    agent: 'main',
    html: 'Non sono sicuro di aver capito. Posso aiutarti con: ' +
          '<br>📖 spiegare un termine (es. "cos\'è lo spread?")' +
          '<br>🧮 calcolare la rata (es. "calcola la mia rata")' +
          '<br>📋 i documenti da preparare (es. "quali documenti servono?")' +
          '<br>🆘 domande su casi specifici (es. "ho un contratto a tempo determinato")'
  };
}

/* ---------- SKILL: COMPLETEZZA CHECKLIST DOCUMENTI ----------
   Estensione dell'Agente Documenti: conta quanti documenti della
   checklist sono stati spuntati e segnala quando sono tutti pronti.
   Nota: controlla solo la completezza, non la validità nel merito
   di ogni singolo documento (una data non basta a garantirla). */

function updateDocsProgress() {
  const fill = document.getElementById('docsProgressFill');
  const text = document.getElementById('docsProgressText');
  if (!fill || !text) return;

  const all = Array.from(document.querySelectorAll('#documents .doc-item input[type="checkbox"]'));
  // Conta solo le voci attualmente visibili: un documento nascosto dal filtro
  // di profilo non deve impedire di raggiungere il 100% di completezza.
  const visible = all.filter(cb => cb.closest('.doc-item').offsetParent !== null);
  const total = visible.length;
  const checked = visible.filter(cb => cb.checked).length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  fill.style.width = pct + '%';

  if (total > 0 && checked === total) {
    text.innerHTML = '✅ <strong>Hai tutta la documentazione pronta per partire con la richiesta di mutuo!</strong>';
    text.classList.add('docs-progress-complete');
    fill.classList.add('docs-progress-fill-complete');
  } else {
    text.textContent = `${checked} di ${total} documenti spuntati`;
    text.classList.remove('docs-progress-complete');
    fill.classList.remove('docs-progress-fill-complete');
  }
}

function initDocsChecklist() {
  const checkboxes = Array.from(document.querySelectorAll('#documents .doc-item input[type="checkbox"]'));
  if (!checkboxes.length) return;
  checkboxes.forEach(cb => cb.addEventListener('change', updateDocsProgress));
  updateDocsProgress();
}

/* ---------- SKILL: FILTRO CHECKLIST PER PROFILO (Agente Documenti) ----------
   Stessa distinzione di profilo già usata in chat (docChecklists sopra),
   applicata direttamente alla checklist statica della pagina: mostra solo
   i documenti di reddito rilevanti per il profilo lavorativo scelto. */

function filterDocsByProfile(profile) {
  document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profile === profile);
  });

  document.querySelectorAll('#documents .doc-item[data-profiles]').forEach(item => {
    const profiles = item.dataset.profiles.split(' ');
    const show = profile === 'tutti' || profiles.includes(profile);
    item.style.display = show ? '' : 'none';
  });

  updateDocsProgress();
}

/* ---------- SKILL: DOMANDA DIRETTA ALL'AGENTE SUPPORTO (inline nella FAQ) ----------
   Riusa supportAgent() — la stessa funzione già usata dalla chat — così la
   logica di riconoscimento resta unica, solo l'interfaccia cambia. */

function askSupportInline() {
  const input = document.getElementById('supportInlineInput');
  const box = document.getElementById('supportInlineAnswer');
  const text = input.value.trim();
  if (!text) return;

  const answer = supportAgent(text);
  if (answer) {
    box.innerHTML = `<div class="inline-agent-answer">${answer}</div>`;
  } else {
    box.innerHTML = '<div class="inline-agent-answer inline-agent-answer-empty">Non ho una risposta pronta per questa domanda specifica — provala nella chat 💬 qui sotto, magari riesco a indirizzarti meglio, oppure consulta un consulente per il tuo caso.</div>';
  }
}

/* ---------- SKILL: SOSTENIBILITÀ RATA (Agente Calcolatore) ----------
   Stesse soglie documentate in agents/skills/mortgage-calculator.md. */

function assessSustainability(rata, reddito) {
  if (!reddito || reddito <= 0) return null;
  const pct = (rata / reddito) * 100;
  if (pct <= 30) return { level: 'ok', emoji: '🟢', label: 'Ottima', pct };
  if (pct <= 35) return { level: 'ok', emoji: '🟢', label: 'Buona', pct };
  if (pct <= 40) return { level: 'warning', emoji: '🟡', label: 'Al limite', pct };
  return { level: 'error', emoji: '🔴', label: 'Critica', pct };
}

/* ---------- UI CHAT WIDGET ---------- */
function initChatWidget() {
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open') && messages.children.length === 0) {
      appendMessage('main', 'Ciao! Sono CasaMia 🏠 Chiedimi un termine, una checklist documenti, di calcolare la rata, o un dubbio specifico sul tuo caso.');
    }
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    appendUserMessage(text);
    input.value = '';

    const result = routeMessage(text);
    setTimeout(() => appendMessage(result.agent, result.html), 300);
  });

  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-user';
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function appendMessage(agent, html) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg chat-msg-bot';
    wrapper.innerHTML = `<span class="chat-agent-badge">${AGENT_LABELS[agent]}</span><div>${html}</div>`;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initChatWidget();
  initDocsChecklist();
});
