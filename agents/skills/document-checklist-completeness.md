# Skill: Completezza Checklist Documenti

## Trigger
- Sezione "Documenti da preparare" dell'app, sotto la checklist a spunta

## Scopo
Dare all'utente un riscontro finale chiaro: "hai spuntato tutto quello che serve o no?". Conta quanti documenti della checklist sono stati selezionati e mostra una barra di avanzamento; quando tutti i documenti sono spuntati, mostra un messaggio di completamento.

## Scelta di design: perché solo completezza, non validità

Una prima versione di questa skill provava a valutare anche la *validità* dei singoli documenti chiedendo date (es. scadenza carta d'identità, data dell'ultima busta paga). È stata scartata perché:

- Una singola data non basta a garantire che un documento sia corretto (può mancare una firma, una pagina, essere il modulo sbagliato)
- Dava un falso senso di sicurezza: un semaforo verde su una data non significa che il documento sia effettivamente idoneo
- La skill non legge file reali (nessun OCR, nessuna chiamata esterna), quindi non può verificare il contenuto — solo l'utente o la banca possono farlo davvero

Per questo la skill si limita a una verifica di **completezza** (hai tutto quello che è nella lista?), lasciando la verifica di validità ai professionisti coinvolti (banca, notaio, agente immobiliare).

## Logica
```
checkbox totali nella checklist = N
checkbox spuntati = K

se K < N  → mostra barra di avanzamento + "K di N documenti spuntati"
se K == N → messaggio di completamento:
            "✅ Hai tutta la documentazione pronta per partire con la richiesta di mutuo!"
```

## Note
- Il conteggio è sulla checklist statica mostrata a tutti gli utenti, non filtrata per profilo lavorativo (quella personalizzata è generata dal Document Agent in chat, vedi `agents/document-agent.md`)
- Nessun dato lasciato dall'utente viene salvato: lo stato delle checkbox vive solo nella sessione del browser
