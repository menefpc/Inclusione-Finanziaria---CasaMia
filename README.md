# CasaMia 🏠
**Il mutuo prima casa spiegato in modo semplice — per chi parte da zero.**

> Strumento di inclusione finanziaria per giovani under 36 che si avvicinano per la prima volta al processo di acquisto della prima casa tramite mutuo.

---

## Struttura del repository

```
/
├── app/                    Applicazione web (soluzione sviluppata)
│   ├── index.html          Guida interattiva al mutuo prima casa
│   ├── styles.css          Stile dell'applicazione
│   └── script.js           Calcolatore rata interattivo
│
├── agents/                 Struttura agentica
│   ├── CLAUDE.md           Configurazione agente principale
│   ├── terminology-agent.md  Agente glossario termini finanziari
│   ├── calculator-agent.md   Agente calcolatore mutuo
│   ├── document-agent.md     Agente checklist documenti
│   ├── support-agent.md      Agente casi difficili e FAQ
│   ├── prompts/            Template di prompt
│   │   ├── onboarding.md   Prompt di onboarding utente
│   │   └── rate-explanation.md  Prompt fisso vs variabile
│   ├── skills/             Skill riutilizzabili
│   │   ├── mortgage-calculator.md  Skill calcolatore
│   │   └── glossary-lookup.md      Skill ricerca glossario
│   └── workflows/          Flussi di lavoro
│       └── mortgage-flow.md  Workflow principale
│
├── presentation/           Presentazione HTML (brand Accenture)
│   └── index.html          Slide deck 7 slide (navigabile con ←→)
│
└── README.md
```

## Come aprire l'app

Apri `app/index.html` direttamente nel browser — nessun server necessario.

## Come vedere la presentazione

Apri `presentation/index.html` nel browser. Naviga con i tasti `←` `→` o i pulsanti a schermo.

## Cosa fa CasaMia

- **Guida passo-passo** in 7 fasi: dalla valutazione iniziale al rogito
- **Glossario interattivo**: 12 termini spiegati con esempi concreti in euro
- **Checklist documenti**: divisa per categoria, con checkbox interattive
- **Calcolatore rata**: calcola rata mensile, LTV, totale interessi in tempo reale
- **FAQ**: le 6 domande più comuni con risposte in linguaggio semplice

## Struttura agentica

Il sistema usa 4 agenti specializzati coordinati da un orchestratore principale:

| Agente | Compito |
|--------|---------|
| CasaMia (principale) | Orchestrazione e routing |
| Terminology Agent | Spiegazioni termini finanziari |
| Calculator Agent | Calcoli rata, LTV, sostenibilità |
| Document Agent | Checklist personalizzata per tipo di lavoro |
| Support Agent | Gestione casi difficili e rifiuti |

---

*Progetto realizzato per il programma di formazione Accenture · Ottobre 2026*
