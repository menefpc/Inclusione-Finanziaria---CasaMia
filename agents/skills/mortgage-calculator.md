# Skill: Calcolatore Mutuo

## Trigger
- `/calcola`
- "quanto mi costa", "calcola la rata", "quanto pago al mese"
- Qualsiasi messaggio con un importo e una durata

## Input richiesti
```yaml
required:
  - valore_immobile: number  # Valore della casa in €
  - anticipo: number         # Anticipo disponibile in €
  - tasso_annuo: number      # Tasso d'interesse annuo in %
  - durata_anni: number      # Durata del mutuo in anni

optional:
  - reddito_mensile: number  # Per il check di sostenibilità
```

## Logica
```python
def calcola_rata(P, r_annuo, anni):
    r = r_annuo / 100 / 12
    n = anni * 12
    if r == 0:
        return P / n
    return P * (r * (1 + r)**n) / ((1 + r)**n - 1)

def calcola_ltv(mutuo, valore):
    return (mutuo / valore) * 100

def sostenibilita(rata, reddito):
    pct = (rata / reddito) * 100
    if pct <= 30: return "ottima"
    if pct <= 35: return "buona"  
    if pct <= 40: return "al limite"
    return "critica"
```

## Output
```
📊 CALCOLO MUTUO

Importo finanziato: €{mutuo:,.0f}
LTV: {ltv:.1f}% {ltv_status}

💰 Rata mensile: €{rata:,.2f}
📆 Durata: {anni} anni ({anni*12} rate)

Totale restituito: €{totale:,.0f}
  di cui interessi: €{interessi:,.0f} ({(interessi/mutuo)*100:.0f}% del capitale)

{sostenibilita_block}
```

## Avvertenze automatiche
- LTV > 80%: "⚠️ Molte banche richiedono garanzie aggiuntive sopra l'80%"
- Rata > 40% reddito: "🔴 La rata è alta rispetto al reddito — valuta un importo minore o una durata maggiore"
- Durata > 30 anni: "ℹ️ Mutui sopra i 30 anni hanno interessi totali molto elevati"
