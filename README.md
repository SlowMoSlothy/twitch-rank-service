# Twitch Rank Service

Kleiner HTTP-Endpunkt für einen StreamElements-`!rank`-Command. Der Rang basiert auf der Watchtime, nicht auf dem ausgebbaren Schokies-Guthaben.

## Ränge

| Watchtime | Rang |
|---:|---|
| < 5 h | ⚪ Unranked |
| 5 h | 🟤 Bronze |
| 10 h | ⚪ Silber |
| 25 h | 🟡 Gold |
| 50 h | 💠 Platin |
| 100 h | 💎 Diamant |
| 200 h | 🟣 Meister |
| 350 h | 🔴 Großmeister |
| 600 h | 🔥 Elite |
| 1000 h | 👑 Legende |

## Deployment mit Vercel

1. Bei Vercel mit GitHub anmelden.
2. **Add New → Project** auswählen.
3. Das Repository `SlowMoSlothy/twitch-rank-service` importieren.
4. Framework Preset kann auf **Other** bleiben. Keine Environment Variables nötig.
5. **Deploy** drücken.
6. Nach dem Deployment erhältst du eine Adresse ähnlich `https://twitch-rank-service.vercel.app`.

Der Endpunkt liegt anschließend unter `/api/rank`.

Test im Browser:

`https://DEINE-VERCEL-DOMAIN/api/rank?user=Test&watchtime=27%20hours&points=1620`

Erwartete Antwort:

`Test [🟡 Gold] – Watchtime: 27 hours – Schokies: 1620`

## StreamElements

Beim Custom Command `!rank` kommt in **Reply**:

`$(customapi https://DEINE-VERCEL-DOMAIN/api/rank?user=$(queryescape "$(user)")&watchtime=$(queryescape "$(user.time_online)")&points=$(user.points))`

`$(queryescape)` ist wichtig, weil die Watchtime Leerzeichen enthält. Der Endpunkt antwortet als kurzer `text/plain`-Text, damit die Antwort direkt im Twitch-Chat ausgegeben werden kann.

## Lokal testen

`npm test`

## Zeitumrechnung

Der Parser versteht Sekunden, Minuten, Stunden, Tage, Wochen, Monate und Jahre. Für die seltenen StreamElements-Ausgaben mit Monaten/Jahren werden 730 Stunden pro Monat und 8760 Stunden pro Jahr verwendet.
