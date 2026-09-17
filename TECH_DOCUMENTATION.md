# NordStay – Teknisk dokumentation

## 1. Översikt

NordStay är en webbapplikation inspirerad av Airbnb, anpassad för affärsresenärer och konferensbokningar. Projektet är byggt utifrån en designprototyp framtagen i Figma och fokus har varit att omsätta designen till en fungerande, responsiv webbapplikation med frontend och backend.

Applikationen låter användare:

* Söka efter boenden baserat på plats
* Visa resultatlista
* Se detaljer för ett boende
* Skapa en bokning
* Se sina bokningar

Projektet är byggt för att uppfylla kraven för Godkänt (G).

---

## 2. Arkitektur – Översikt

Applikationen är uppdelad i två huvuddelar:

* **Frontend**: React + Vite
* **Backend**: Node.js + Express

Frontend och backend kommunicerar via ett REST API med JSON som dataformat.

---

## 3. Frontend

### 3.1 Teknikval

* **React** – komponentbaserat ramverk för UI
* **Vite** – snabb utvecklingsmiljö
* **React Router** – routing mellan sidor
* **TypeScript** – typkontroll för ökad tydlighet och säkerhet
* **Tailwind CSS** – styling enligt designprototyp

### 3.2 Struktur

```
client/
 ├─ src/
 │  ├─ pages/        (sidor som Home, Results, Listing, Booking)
 │  ├─ components/   (Header, SearchBar, ListingCard m.m.)
 │  ├─ routes/       (AppRoutes.tsx)
 │  ├─ utils/        (apiClient för API-anrop)
 │  ├─ types/        (TypeScript-typer)
 │  └─ main.tsx
```

### 3.3 Routing

Routing hanteras med React Router.

Exempel:

* `/` – Startsida
* `/results` – Resultatsida
* `/listing/:id` – Detaljsida för boende
* `/mybookings` – Användarens bokningar

### 3.4 Datahämtning

Frontend hämtar data från backend via `fetch` (inkapslat i `apiClient`).

Applikationen visar laddningsstatus och enkla felmeddelanden om något går fel.

---

## 4. Backend

### 4.1 Teknikval

* **Node.js** – JavaScript-runtime
* **Express** – webbramverk för API
* **TypeScript** – tydligare kod och typer
* **In-memory data** – används för Godkänt-nivå

### 4.2 Struktur

```
server/
 ├─ src/
 │  ├─ routes/       (auth, listings, bookings)
 │  ├─ data/         (mockdata för listings)
 │  ├─ index.ts      (serverstart)
 │  └─ models/
```

### 4.3 API-endpoints

Exempel på implementerade endpoints:

* `GET /health` – Hälsokontroll
* `GET /listings` – Hämta alla boenden
* `GET /listings/:id` – Hämta ett boende
* `POST /listings` – Skapa nytt boende (CRUD-test)
* `POST /bookings` – Skapa bokning
* `GET /bookings?userId=...` – Hämta användarens bokningar

Validering sker på servern och meningsfulla felmeddelanden returneras vid fel.

---

## 5. Kommunikation mellan frontend & backend

Frontend kommunicerar med backend via HTTP-anrop.

Exempel på flöde:

1. Användaren söker boenden
2. Frontend anropar `GET /listings`
3. Backend returnerar JSON-data
4. Frontend renderar resultatlistan
5. Vid bokning skickas data till `POST /bookings`

---

## 6. Tekniska val & motivering

* **In-memory data** användes för att hålla projektet enkelt och tydligt enligt G-kraven
* **React + Vite** valdes för snabb utveckling
* **TypeScript** används för bättre struktur och förklarbar kod
* **Tailwind CSS** gjorde det möjligt att följa designprototypen noggrant

---

## 7. Utmaningar och lösningar

### Routing-problem

Ett vanligt problem var att sidor inte renderades korrekt. Detta löstes genom att:

* Säkerställa korrekta routes i `AppRoutes.tsx`
* Kontrollera URL-struktur och parametrar

### Bildhantering

Problem uppstod med externa bildlänkar. Detta löstes genom:

* Lokala bilder i `public/images`
* Anpassning av `imageUrl` i backend-data

---

## 8. Begränsningar

* Ingen riktig databas används
* Ingen riktig autentisering (demo-user används)
* Betalning är simulerad

Dessa val är gjorda för att fokusera på grundfunktionalitet och designimplementering.

---

## 9. Sammanfattning

NordStay uppfyller kraven för Godkänt genom:

* Fungerande frontend i React
* Backend med boenden och bokningar
* Korrekt integration mellan frontend och backend
* Tydlig struktur och dokumentation

Projektet är byggt med fokus på tydlighet, enkelhet och förklarbar kod.
