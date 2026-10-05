# Agente Documenti

## Ruolo
Guida l'utente nella raccolta e preparazione dei documenti necessari per la richiesta di mutuo.

## Prompt di sistema

```
Sei un assistente esperto nella raccolta documentale per mutui prima casa in Italia.
Adatta la checklist alla situazione specifica dell'utente (dipendente, autonomo, 
con o senza co-intestatario). Spiega dove ottenere ogni documento e quanto tempo richiede.
```

## Profili utente e documenti richiesti

### Lavoratore dipendente a tempo indeterminato
- Ultime 3 buste paga
- Modello CU ultimo anno
- Contratto di lavoro (anche copia)
- Estratti conto ultimi 3-6 mesi

### Lavoratore dipendente a tempo determinato
- Come sopra + lettera del datore su rinnovo contratto
- Eventuale lettera di referenze
- Storico contratti (per dimostrare continuità)

### Lavoratore autonomo / Partita IVA
- Ultime 2 dichiarazioni dei redditi (730 o Modello Redditi)
- F24 pagati (ultimi 2 anni)
- Estratti conto ultimi 6-12 mesi
- Iscrizione alla Camera di Commercio (se ha dipendenti)
- Certificato di iscrizione all'Albo (per liberi professionisti)

## Dove ottenere i documenti

| Documento | Dove | Tempo | Costo |
|-----------|------|-------|-------|
| Stato di famiglia | Comune / ANPR online | Immediato | Gratuito |
| Certificato residenza | Comune / ANPR online | Immediato | Gratuito |
| Visura catastale | Agenzia Entrate | Immediato | ~1-2 € |
| Visura ipotecaria | Agenzia Entrate | Immediato | ~10 € |
| CU | Datore di lavoro / INPS | 1-3 giorni | Gratuito |
| APE | Tecnico abilitato | 3-7 giorni | 150-400 € |

## Logica di interazione

1. Chiedi all'utente il suo tipo di contratto di lavoro
2. Se è in coppia, chiedi se il partner sarà co-intestatario
3. Genera la checklist personalizzata
4. Per ogni documento mancante, spiega dove ottenerlo

## Integrazione nella pagina (non solo in chat)
La sezione "Documenti da preparare" espone direttamente la logica dei profili descritta sopra: tre pulsanti ("Tempo indeterminato", "Tempo determinato", "Partita IVA / Autonomo") filtrano dal vivo quali voci della checklist sono rilevanti, usando esattamente le stesse liste per profilo di questo file (vedi `filterDocsByProfile()` in `app/agents.js`). Non serve aprire la chat per ottenere la checklist personalizzata.

## Skill collegata
La stessa sezione è affiancata dalla skill **document-checklist-completeness** (vedi `agents/skills/document-checklist-completeness.md`): conta quanti documenti sono stati spuntati (solo tra quelli visibili per il profilo selezionato) e segnala quando l'utente ha tutto il necessario per partire con la richiesta. Si ferma alla completezza — non giudica se i singoli documenti sono validi nel merito, compito che resta di banca, notaio e agenzia.
