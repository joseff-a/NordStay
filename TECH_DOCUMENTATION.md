# NordStay – Teknisk dokumentation

## 1. Översikt

NordStay är en webbapplikation för att söka och boka konferenslokaler i Stockholm, Göteborg och Malmö. Designen är inspirerad av Airbnb och projektet är byggt utifrån en designprototyp framtagen i Figma. Fokus har varit att omsätta designen till en fungerande, responsiv webbapplikation med frontend och backend.

Applikationen låter användare:

* Söka efter konferenslokaler baserat på plats
* Visa resultatlista
* Se detaljer och bilder för en lokal
* Välja datum, tid och antal deltagare
* Skapa en bokning
* Registrera sig, logga in och se sina bokningar

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
 │  ├─ pages/        (sidor som Home, Results, Listing, Booking, Confirmation)
 │  ├─ components/   (Header, SearchBar, ListingCard)
 │  ├─ contexts/     (AuthContext för inloggad användare)
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
* `/listing/:id` – Detaljsida för lokal
* `/confirmation/:bookingId` – Bekräftelsesida efter bokning
* `/mybookings` – Användarens bokningar
* `/booking/:id` – Bokningsöversikt
* `/auth/login` – Inloggning
* `/auth/register` – Registrering

### 3.4 Datahämtning

Frontend hämtar data från backend via HTTP-anrop som samlats i `apiClient`.

Applikationen visar laddningsstatus och enkla felmeddelanden om något går fel.

### 3.5 Inloggning

Vilken användare som är inloggad hanteras med en `AuthContext`. Bokningsflödet kräver att man är inloggad, annars skickas man till inloggningssidan.

---

## 4. Backend

### 4.1 Teknikval

* **Node.js** – JavaScript-runtime
* **Express** – webbramverk för API
* **TypeScript** – tydligare kod och typer
* **bcryptjs** – hashar lösenord så att de inte sparas i klartext
* **jsonwebtoken** – skapar en inloggningstoken (JWT) vid inloggning
* **In-memory data** – används för Godkänt-nivå

### 4.2 Struktur

```
server/
 ├─ src/
 │  ├─ routes/       (auth, listings, bookings)
 │  ├─ data/         (listings.ts med alla lokaler, mock.ts med demoanvändare)
 │  ├─ models/       (typer)
 │  └─ index.ts      (serverstart)
```

### 4.3 API-endpoints

Implementerade endpoints:

* `GET /health` – Hälsokontroll
* `POST /auth/register` – Registrera ny användare
* `POST /auth/login` – Logga in, returnerar token och användaruppgifter
* `GET /listings` – Hämta alla lokaler (valfritt `?q=` för att söka på titel, stad eller land)
* `GET /listings/:id` – Hämta en lokal
* `POST /listings` – Skapa ny lokal (CRUD-test)
* `GET /bookings` – Hämta bokningar (valfritt `?userId=...` för en användares bokningar)
* `GET /bookings/:id` – Hämta en bokning
* `POST /bookings` – Skapa bokning

Validering sker på servern och meningsfulla felmeddelanden returneras vid fel. Vid bokning kontrolleras bland annat att obligatoriska fält finns, att antal deltagare är minst 1 och att sluttiden är senare än starttiden.

---

## 5. Kommunikation mellan frontend & backend

Frontend kommunicerar med backend via HTTP-anrop.

Exempel på flöde:

1. Användaren söker en lokal
2. Frontend hämtar lokaler från `GET /listings`
3. Backend returnerar JSON-data
4. Frontend renderar resultatlistan
5. Användaren väljer datum, tid och antal deltagare och går vidare till bokningsöversikten
6. Vid bokning skickas data till `POST /bookings`
7. Bekräftelsesidan visar bokningen och användaren kan se den under Mina bokningar

---

## 6. Tekniska val & motivering

* **In-memory data** användes för att hålla projektet enkelt och tydligt enligt G-kraven
* **React + Vite** valdes för snabb utveckling
* **TypeScript** används för bättre struktur och förklarbar kod
* **Tailwind CSS** gjorde det möjligt att följa designprototypen noggrant
* **Lokala bilder** i `public/images` gör att sidan inte beror på externa bildlänkar
* **Demoanvändare** finns i koden så att man alltid kan logga in direkt efter en omstart av servern

---

## 7. Utmaningar och lösningar

### Routing-problem

Ett vanligt problem var att sidor inte renderades korrekt. Detta löstes genom att:

* Säkerställa korrekta routes i `AppRoutes.tsx`
* Kontrollera URL-struktur och parametrar

### Bildhantering

Problem uppstod med externa bildlänkar. Detta löstes genom:

* Lokala bilder i `public/images`
* Anpassning av `imageUrl` och `galleryImages` i backend-data

### Från boenden till konferenslokaler

Projektet började som en bokningssida för boenden och byggdes om till att bara handla om konferenslokaler. Gammal data, gamla typer och oanvänd kod togs bort så att koden bara beskriver det som sidan faktiskt gör.

---

## 8. Begränsningar

* Ingen riktig databas används. Användare och bokningar försvinner när servern startas om
* Servern kontrollerar inte inloggningstoken när en bokning skapas. Kravet på inloggning finns i frontend
* Det finns ingen kontroll av dubbelbokningar
* Totalpriset skickas från frontend och räknas inte om på servern
* Ingen betalning ingår

Dessa val är gjorda för att fokusera på grundfunktionalitet och designimplementering.

---

## 9. Sammanfattning

NordStay uppfyller kraven för Godkänt genom:

* Fungerande frontend i React
* Backend med lokaler, användare och bokningar
* Korrekt integration mellan frontend och backend
* Tydlig struktur och dokumentation

Projektet är byggt med fokus på tydlighet, enkelhet och förklarbar kod.
