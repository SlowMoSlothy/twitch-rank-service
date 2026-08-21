# Twitch Rank Service

Ein kleiner HTTP-Endpunkt für einen StreamElements-`!rank`-Command. Der Rang wird anhand der Watchtime bestimmt. Zusätzlich können die StreamElements-Loyalty-Punkte angezeigt werden.

Die Ausgabe ist bewusst kurz für den Twitch-Chat:

```text
[2nd Kyū - Veteranenschüler] – Im Training: 100 Stunden – Punkte: 6000
```

Es werden nur volle Stunden angezeigt. Minuten und Sekunden werden intern für die Rangberechnung berücksichtigt, aber nicht ausgegeben.

## Benötigte Dateien

Für das Deployment auf Vercel sind im Wesentlichen diese Dateien relevant:

```text
twitch-rank-service/
├── api/
│   └── rank.js
├── package.json
└── README.md
```

- `api/rank.js` enthält API, Watchtime-Parser, Ränge, Titel und Ausgabeformat.
- `package.json` aktiviert ES Modules und definiert die Node.js-Umgebung.
- `README.md` ist nur die Dokumentation und wird für die API selbst nicht benötigt.

Eine `vercel.json` ist für dieses Projekt nicht erforderlich.

## Rangsystem

| Watchtime ab | Rang | Titel |
|---:|---|---|
| 1800 h | 5. Dan | Großmeister |
| 1000 h | 4. Dan | Hoher Meister |
| 600 h | 3. Dan | Meister |
| 350 h | 2. Dan | Veteran |
| 200 h | 1. Dan | Kämpfer |
| 135 h | 1st Kyū | Meisterschüler |
| 100 h | 2nd Kyū | Veteranenschüler |
| 70 h | 3rd Kyū | Adept |
| 45 h | 4th Kyū | Fortgeschrittener |
| 25 h | 5th Kyū | Schüler |
| 10 h | 6th Kyū | Novize |
| 0 h | Agōkai | Mitglied |

Führungsrollen wie Sensei, Shihan oder Senpai sind absichtlich nicht Teil der automatischen Watchtime-Ränge.

## Eigenes Rangsystem verwenden

Die Ränge stehen am Anfang von `api/rank.js` im Array `RANKS`:

```js
const RANKS = [
  { hours: 1800, rank: '5. Dan', title: 'Großmeister' },
  { hours: 1000, rank: '4. Dan', title: 'Hoher Meister' },
  // ...
  { hours: 0, rank: 'Agōkai', title: 'Mitglied' },
];
```

Für eigene Ränge einfach `hours`, `rank` und `title` ändern. Die Einträge sollten von der höchsten zur niedrigsten benötigten Watchtime sortiert bleiben.

## Repository für den eigenen Kanal übernehmen

Am einfachsten:

1. Dieses Repository auf GitHub **forken**.
2. Im eigenen Fork bei Bedarf `api/rank.js` bearbeiten und das Rangsystem anpassen.
3. Den eigenen Fork anschließend mit Vercel verbinden.

Alternativ können die Dateien in ein neues eigenes GitHub-Repository kopiert werden.

## Deployment mit Vercel

1. Bei Vercel anmelden und GitHub verbinden.
2. **Add New → Project** auswählen.
3. Den eigenen Fork bzw. das eigene Repository importieren.
4. **Framework Preset: Other** verwenden.
5. **Root Directory** auf dem Repository-Stamm (`./`) lassen.
6. Für dieses Projekt sind keine Environment Variables erforderlich.
7. **Deploy** auswählen.

Vercel stellt JavaScript-Dateien im `/api`-Verzeichnis als Functions bereit. Der Endpoint dieses Projekts lautet daher nach dem Deployment:

```text
https://DEINE-VERCEL-DOMAIN/api/rank
```

## API im Browser testen

Beispiel:

```text
https://DEINE-VERCEL-DOMAIN/api/rank?user=Test&watchtime=100%20hours&points=6000
```

Erwartete Antwort:

```text
[2nd Kyū - Veteranenschüler] – Im Training: 100 Stunden – Punkte: 6000
```

Der Parameter `user` wird derzeit akzeptiert, aber absichtlich nicht in der kompakten Chat-Ausgabe angezeigt.

## StreamElements einrichten

In StreamElements einen Custom Command `!rank` erstellen bzw. bearbeiten.

Empfohlene Einstellungen:

- **Command name:** `!rank`
- **Response type:** `Say`
- **User level:** `Everyone`

In **Reply** kommt der Aufruf des eigenen Vercel-Endpunkts. Verwende dabei die StreamElements-Variablen für Benutzer, Watchtime und Loyalty-Punkte und URL-encode Werte mit Leerzeichen entsprechend.

Wichtig: Die Watchtime und Punkte stammen von StreamElements. Bei einem neu eingerichteten Loyalty-System können deshalb zunächst `0 Stunden` und `0 Punkte` erscheinen; vorhandene Twitch-Watchtime wird dadurch nicht automatisch rückwirkend übernommen.

## Ausgabe ändern

Die Chat-Ausgabe wird am Ende von `api/rank.js` erzeugt:

```js
const output = `[${rank.rank} - ${rank.title}] – Im Training: ${formatHours(hours)} Stunden – Punkte: ${points}`;
```

Hier kann das Format für den eigenen Kanal angepasst werden.

## Watchtime-Verarbeitung

Der Parser versteht unter anderem Sekunden, Minuten, Stunden, Tage und Wochen sowie StreamElements-Ausgaben, die mehrere Zeiteinheiten enthalten.

Beispiel:

```text
100 hours 47 mins 32 secs
```

wird intern vollständig ausgewertet. Im Twitch-Chat erscheint aufgrund der kompakten Ausgabe jedoch nur:

```text
100 Stunden
```

## Lokaler Test

Falls Node.js installiert ist:

```bash
npm test
```

## Hinweise

- Keine Datenbank erforderlich.
- Keine API-Keys erforderlich.
- Keine Environment Variables erforderlich.
- Keine externen npm-Abhängigkeiten erforderlich.
- Änderungen am GitHub-Repository werden nach der Vercel-Verknüpfung automatisch neu deployed.
