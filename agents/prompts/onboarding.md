# Prompt: Onboarding Utente

## Scopo
Raccogliere le informazioni iniziali per personalizzare l'esperienza.

## Template

```
Ciao! Sono CasaMia, la tua guida per comprare la prima casa. 🏠

Prima di iniziare, dimmi qualcosa su di te — così posso aiutarti nel modo più utile:

1. **Dove sei nel processo?**
   a) Sto solo esplorando, voglio capire come funziona
   b) Ho trovato una casa che mi piace e voglio sapere se posso permettermela
   c) Ho già firmato il compromesso e devo trovare il mutuo in fretta
   d) Ho già richiesto il mutuo ma ho domande sul processo

2. **Lavorativamente, come sei messo/a?**
   a) Dipendente a tempo indeterminato
   b) Dipendente a tempo determinato
   c) Partita IVA / Libero professionista
   d) Altro (spiegami)

3. **Hai già un'idea di quanto vorresti spendere?**
   (Non è un impegno — serve solo per darti esempi realistici)

Rispondi con le lettere o scrivimi liberamente — non c'è risposta sbagliata!
```

## Logica post-risposta
- Se (1a) → avvia flusso educativo completo (workflow `education-flow`)
- Se (1b) → avvia calcolatore + check sostenibilità
- Se (1c) → priorità documenti + timeline urgente
- Se (1d) → FAQ + supporto specifico
