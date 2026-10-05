# Skill: Lookup Glossario

## Trigger
- `/glossario [termine]`
- "cosa significa", "che vuol dire", "spiegami"
- Rilevamento automatico di termini tecnici nel testo dell'utente

## Termini riconosciuti (pattern matching)
```
taeg|tan|spread|euribor|irs|ltv|loan.to.value|ammortamento|
perizia|istruttoria|delibera|rogito|compromesso|caparra|
crif|fidejussione|ipoteca|surroga|portabilità|estinzione|
isee|consap|prima.casa|agevolazioni|catastale|visura
```

## Template risposta
```
📖 **{TERMINE}**

{DEFINIZIONE_SEMPLICE}

**Esempio pratico:**
{ESEMPIO_CON_NUMERI}

**Perché ti interessa:**
{RILEVANZA_PRATICA}

Vuoi approfondire o hai altre domande su questo termine?
```

## Database termini (estratto)

```yaml
TAEG:
  definizione: "Il costo totale reale del mutuo espresso in percentuale annua. Include tasso d'interesse, commissioni, assicurazioni obbligatorie e tutte le spese."
  esempio: "Un mutuo con TAN 3.5% può avere TAEG 4.1% se aggiungi le spese di istruttoria, perizia e assicurazione. Quei 0.6 punti su €200.000 in 25 anni sono circa €15.000 di differenza."
  rilevanza: "Confronta sempre il TAEG, non il TAN. Due mutui con lo stesso TAN possono avere TAEG molto diversi."

LTV:
  definizione: "Loan-to-Value: il rapporto tra l'importo del mutuo e il valore dell'immobile."
  esempio: "Casa da €200.000, anticipo €40.000, mutuo €160.000 → LTV = 160/200 = 80%."
  rilevanza: "Sotto l'80% ottieni tassi migliori. Sopra l'80% alcune banche non prestano, altre applicano tassi più alti."

CRIF:
  definizione: "Banca dati privata che raccoglie la storia creditizia degli italiani (mutui, prestiti, finanziamenti, pagamenti in ritardo)."
  esempio: "Se hai saltato 3 rate del prestito auto 2 anni fa, la banca lo vede nel tuo report CRIF."
  rilevanza: "Puoi richiedere il tuo report CRIF gratuitamente su crif.it — fallo prima di andare in banca così non hai sorprese."
```
