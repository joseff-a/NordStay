# NordStay – Webbapplikation för bokning av boenden

NordStay är en webbapplikation där användare kan söka boenden, se detaljer, göra bokningar och se sina bokningar.  
Projektet är byggt som en fullstack-applikation med React i frontend och Node.js/Express i backend.

## Tekniker
### Frontend
- React + Vite
- TypeScript
- React Router
- Tailwind CSS
- Axios för API-anrop

### Backend
- Node.js
- Express
- TypeScript
- In-memory data (för Godkänt-nivå)

---

## Funktionalitet
- Sök boenden baserat på plats
- Visa lista med boenden
- Visa detaljsida för boende
- Skapa bokning
- Visa bekräftelse efter bokning
- Visa användarens bokningar
- CRUD för boenden (läs & skapa)

---
Projekt struktur 

client/
  src/
    components/
    pages/
    routes/
    utils/

server/
  src/
    routes/
    data/
