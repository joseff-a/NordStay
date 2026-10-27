# NordStay

NordStay är en webbapplikation där man kan söka och boka konferenslokaler i Stockholm, Göteborg och Malmö. Man kan söka lokaler, se detaljer och bilder, välja datum, tid och antal deltagare, boka och se sina bokningar.

Projektet har en frontend i React och en backend i Node.js/Express.

## Tekniker

Frontend: React, Vite, TypeScript, React Router, Tailwind CSS

Backend: Node.js, Express, TypeScript, bcryptjs, jsonwebtoken

## Starta projektet

Du behöver Node.js 20.19 eller senare.

Starta backend (port 4000):

```
cd server
npm install
npm run dev
```

Starta frontend i ett nytt terminalfönster (port 5173):

```
cd client
npm install
npm run dev
```

Öppna sedan http://localhost:5173 i webbläsaren.

## Demoanvändare

- demo@nordstay.se / password
- admin@nordstay.se / password

Du kan också registrera ett eget konto.

## Funktioner

- Sök konferenslokaler på stad
- Resultatlista och detaljsida med bilder
- Välj datum, tid och antal deltagare
- Bokningsöversikt, bokning och bekräftelse
- Mina bokningar
- Registrera, logga in och logga ut

## Data

Lokalerna ligger i `server/src/data/listings.ts`. Registrerade användare och bokningar sparas bara i minnet och försvinner när servern startas om. Demoanvändarna finns alltid.

## Mappstruktur

```
client/src   components, pages, routes, utils, types
server/src   routes, data, models
```

## Dokumentation

- `TECH_DOCUMENTATION.md` – teknisk beskrivning av projektet
- `MANUAL_TESTS.md` – manuella tester
