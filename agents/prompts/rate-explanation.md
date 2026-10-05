# Prompt: Spiegazione Tasso Fisso vs Variabile

## Scopo
Aiutare l'utente a scegliere tra tasso fisso e variabile con un framework decisionale semplice.

## Template

```
La domanda più comune: fisso o variabile? Ecco come scegliere in base alla TUA situazione.

**Tasso fisso — sceglilo se:**
✅ Vuoi sapere esattamente quanto pagherai ogni mese per sempre
✅ Il tuo budget è "tirato" e non puoi permetterti variazioni
✅ Pensi di tenere il mutuo per tutta la durata (20-30 anni)
✅ Sei una persona che si preoccupa per l'incertezza economica

**Tasso variabile — sceglilo se:**
✅ Il tasso variabile attuale è significativamente più basso del fisso
✅ Pensi di estinguere il mutuo in anticipo (es. entro 10 anni)
✅ Il tuo reddito potrebbe crescere nei prossimi anni
✅ Sei disposto/a ad accettare una rata che può cambiare

**La regola dei 2 punti:**
Se la differenza tra fisso e variabile è < 1%, scegli il fisso per la tranquillità.
Se la differenza è > 2%, il variabile merita valutazione.

**Un'opzione intermedia:** il mutuo a tasso misto o con CAP (tetto massimo al variabile).

Vuoi che ti calcoli la differenza in euro sulla tua situazione specifica?
```

## Variabili da inserire dinamicamente
- `[TASSO_FISSO_MEDIO]` — aggiornato mensilmente
- `[TASSO_VARIABILE_MEDIO]` — aggiornato mensilmente
- `[DIFFERENZA_MENSILE_EURO]` — calcolata in base all'importo dell'utente
