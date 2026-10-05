# Workflow: Mortgage Guidance Flow

## Overview
Flusso principale che coordina gli agenti specializzati per guidare l'utente attraverso il processo di acquisto.

## Diagramma

```
START
  │
  ▼
[Onboarding Prompt]
  │
  ├─ Utente esplorativo ──────► [Education Flow]
  │                                    │
  ├─ Ha trovato casa ─────────► [Feasibility Check]
  │                                    │
  ├─ Ha il compromesso ───────► [Urgent Document Flow]
  │                                    │
  └─ Ha il mutuo in corso ────► [Support Flow]
                                       │
                                       ▼
                              [Risposta contestuale]
```

## Fase 1: Education Flow
```
Input: utente che vuole capire il processo

Steps:
  1. Spiega il processo in 7 passi (overview ad alto livello)
  2. Chiedi dove vuole approfondire
  3. Usa terminology-agent per spiegazioni dettagliate
  4. Offri calcolo di esempio con dati ipotetici
  5. Rimanda a /documenti per la checklist

Output: utente ha una mappa mentale chiara del percorso
```

## Fase 2: Feasibility Check
```
Input: prezzo casa target, reddito mensile, risparmi disponibili

Steps:
  1. Calcola anticipo minimo necessario (20% del prezzo)
  2. Calcola importo mutuo massimo sostenibile (rata ≤ 33% reddito)
  3. Calcola LTV e verifica soglia 80%
  4. Verifica agevolazioni under 36 / Consap
  5. Presenta risultato con semaforo (verde/giallo/rosso)

Semaforo:
  🟢 Verde: LTV ≤ 80%, rata ≤ 33% reddito → "Situazione ottima, procedi!"
  🟡 Giallo: LTV tra 80-90% o rata 33-40% → "Possibile ma con attenzioni"
  🔴 Rosso: LTV > 90% o rata > 40% → "Difficile senza agevolazioni o garante"

Output: valutazione personalizzata + prossimi passi consigliati
```

## Fase 3: Urgent Document Flow
```
Input: data del rogito concordata (scadenza)

Steps:
  1. Calcola giorni rimasti
  2. Genera checklist prioritizzata per situazione lavorativa
  3. Spiega dove ottenere ogni documento mancante
  4. Suggerisci timeline per raccolta documenti
  5. Avvisa se i tempi sono troppo stretti

Output: piano d'azione con scadenze intermedie
```

## Fase 4: Support Flow
```
Input: domanda specifica o problema nel processo

Steps:
  1. Classifica il tipo di problema (rifiuto, perizia bassa, documenti, etc.)
  2. Instrada verso support-agent.md
  3. Fornisce risposta contestuale
  4. Se caso complesso → escalation a broker/consulente

Output: risposta o piano d'azione alternativo
```

## Gestione degli errori
- Input mancante: chiedi solo ciò che è strettamente necessario, non di più
- Dati inconsistenti: segnala l'incongruenza all'utente con gentilezza
- Caso fuori scope: riconosci il limite e suggerisci un professionista

## Metriche di successo
- L'utente comprende il passo successivo concreto da fare
- L'utente ha almeno un numero (rata, LTV, percentuale) come riferimento
- L'utente non si sente sopraffatto dalla complessità
