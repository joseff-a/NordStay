# Manuella tester – NordStay

## Miljö
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

---

## 1. Hälsokontroll (API)
**Steg**
1. Öppna `http://localhost:4000/health`

**Förväntat resultat**
- JSON-svar: `{ "status": "ok" }`

**Resultat**
- Godkänt

---

## 2. Sökflöde: Startsida → Resultat
**Steg**
1. Gå till startsidan `/`
2. Fyll i Destination (ex: “Stockholm, Sverige”)
3. (Valfritt) välj datum och gäster
4. Klicka “Sök”

**Förväntat resultat**
- Du skickas till `/results?...`
- Resultatlista visas med boenden för vald plats

**Resultat**
- Godkänt

---

## 3. Resultat → Detaljsida
**Steg**
1. På Resultatsidan, klicka på ett boende

**Förväntat resultat**
- Du navigeras till `/listing/:id`
- Detaljsida laddar och visar titel, bilder (minst en), och bokningskort

**Resultat**
- Godkänt

---

## 4. Bokning: Detaljsida → Bekräftelse
**Steg**
1. På detaljsidan, välj Incheckning och Utcheckning
2. Välj antal gäster
3. Klicka “Reservera”

**Förväntat resultat**
- Bokning skapas via `POST /bookings`
- Du skickas till bekräftelsesida `/confirmation/:bookingId`
- Bekräftelsesidan visar bokningsinformation (minst boknings-ID)

**Resultat**
- Godkänt

---

## 5. Bekräftelse → Mina bokningar
**Steg**
1. På bekräftelsesidan, klicka “Visa mina bokningar”

**Förväntat resultat**
- Du navigeras till `/bookings/me`
- Bokningen du nyss skapade syns i listan

**Resultat**
- Godkänt

---

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
