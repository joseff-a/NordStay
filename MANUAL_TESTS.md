# Manuella tester – NordStay

## Miljö
- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Demoanvändare: demo@nordstay.se / password

---

## 1. Hälsokontroll (API)
**Steg**
1. Öppna `http://localhost:4000/health`

**Förväntat resultat**
- JSON-svar: `{ "status": "ok" }`

**Resultat**
-

---

## 2. Sökflöde: Startsida → Resultat
**Steg**
1. Gå till startsidan `/`
2. Skriv en stad i sökfältet (t.ex. “Stockholm”)
3. Klicka “Sök”

**Förväntat resultat**
- Du skickas till `/results?...`
- Resultatlistan visar konferenslokaler för vald stad

**Resultat**
-

---

## 3. Resultat → Detaljsida
**Steg**
1. På resultatsidan, klicka på en lokal

**Förväntat resultat**
- Du navigeras till `/listing/:id`
- Detaljsidan visar titel, en stor bild och fyra mindre bilder samt bokningskortet

**Resultat**
-

---

## 4. Registrera ny användare
**Steg**
1. Gå till registreringssidan
2. Fyll i namn, e-post och lösenord och registrera

**Förväntat resultat**
- Kontot skapas och du kan logga in med det

**Resultat**
-

---

## 5. Logga in och logga ut
**Steg**
1. Logga in med demoanvändaren
2. Logga ut
3. Logga in med den nyregistrerade användaren

**Förväntat resultat**
- Inloggning och utloggning fungerar för båda användarna

**Resultat**
-

---

## 6. Bokningsflödet kräver inloggning
**Steg**
1. Logga ut
2. Öppna en lokal, välj datum, tid och antal deltagare och klicka “Fortsätt”

**Förväntat resultat**
- Du skickas till inloggningssidan

**Resultat**
-

---

## 7. Bokning: Detaljsida → Bekräftelse
**Steg**
1. Logga in
2. På detaljsidan, välj datum, starttid, sluttid och antal deltagare
3. Klicka “Fortsätt”
4. Kontrollera uppgifterna på bokningsöversikten
5. Klicka “Boka lokal”

**Förväntat resultat**
- Bokningsöversikten visar rätt lokal, tid, antal deltagare och totalpris
- Bokning skapas via `POST /bookings`
- Du skickas till bekräftelsesidan `/confirmation/:bookingId`

**Resultat**
-

---

## 8. Bekräftelse → Mina bokningar
**Steg**
1. Gå vidare till Mina bokningar från bekräftelsesidan eller från menyn

**Förväntat resultat**
- Du navigeras till Mina bokningar
- Bokningen du nyss skapade syns i listan

**Resultat**
-

---

## 9. Lista bokningar via API
**Steg**
1. Öppna `http://localhost:4000/bookings`

**Förväntat resultat**
- JSON-array med bokningar
- Nya bokningar dyker upp efter att man bokat i appen

**Resultat**
-

---

## 10. Lista lokaler via API
**Steg**
1. Öppna `http://localhost:4000/listings`

**Förväntat resultat**
- JSON-array med alla lokaler

**Resultat**
-

---

## 11. Skapa lokal via API (CRUD – Create)
**Steg**
1. Skapa en lokal med `POST /listings` (t.ex. via fetch i DevTools)
2. Öppna `GET /listings` igen

**Förväntat resultat**
- API svarar med status 201 och returnerar den nya lokalen
- Den nya lokalen finns med i listan när man hämtar lokaler igen

**Resultat**
-

---

## 12. Felhantering: Ingen träff i sök
**Steg**
1. Sök på en plats som inte finns i datan (t.ex. “Umeå”)

**Förväntat resultat**
- Sidan visar ett meddelande om att inga lokaler hittades

**Resultat**
-

---

## 13. Efter omstart av servern
**Steg**
1. Stoppa backend och starta den igen
2. Logga in med demoanvändaren
3. Kontrollera Mina bokningar och försök logga in med den nyregistrerade användaren

**Förväntat resultat**
- Demoanvändaren kan logga in
- Lokalerna laddas som vanligt
- Nyregistrerade användare och tidigare bokningar finns inte kvar eftersom data sparas i minnet

**Resultat**
-

---

## 14. Responsivitet (snabbkontroll)
**Steg**
1. Öppna DevTools → toggle device toolbar
2. Testa bredder:
   - Mobil (t.ex. 390px)
   - Surfplatta (t.ex. 768px)
   - Desktop (t.ex. 1200px)

**Förväntat resultat**
- Layouten anpassar sig utan att element går sönder
- Sökfält, resultatlista och detaljsida är användbara i alla storlekar

**Resultat**
-

## 6. Lista bokningar via API
**Steg**
1. Öppna `http://localhost:4000/bookings?userId=demo-user-1`

**Förväntat resultat**
- JSON-array med bokningar för demo-användaren
- Nya bokningar dyker upp efter att man bokat i appen

**Resultat**
- Godkänt

---

## 7. Lista boenden via API
**Steg**
1. Öppna `http://localhost:4000/listings`

**Förväntat resultat**
- JSON-array med boenden

**Resultat**
- Godkänt

---

## 8. Skapa boende via API (CRUD – Create)
**Steg**
1. Skapa ett boende med `POST /listings` (t.ex. via fetch i DevTools)
2. Öppna `GET /listings` igen

**Förväntat resultat**
- API svarar med status 201 och returnerar det nya boendet
- Det nya boendet finns med i listan när man hämtar boenden igen

**Resultat**
- Godkänt

---

## 9. Felhantering: Ingen träff i sök
**Steg**
1. Sök på en plats som inte finns i datan (ex: “Umeå”)

**Förväntat resultat**
- UI visar meddelande om att inga boenden hittades

**Resultat**
- Godkänt

---

## 10. Responsivitet (snabbkontroll)
**Steg**
1. Öppna DevTools → toggle device toolbar
2. Testa bredder:
   - Mobil (t.ex. 390px)
   - Surfplatta (t.ex. 768px)
   - Desktop (t.ex. 1200px)

**Förväntat resultat**
- Layouten anpassar sig utan att element går sönder
- Sökfält, resultatlista och detaljsida är användbara i alla storlekar

**Resultat**
- Godkänt
