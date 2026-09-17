import { Router, Request, Response } from "express";

interface Booking {
  id: string;
  listingId: string;
  userId: string;
  kind: "conference";
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  from: string;
  to: string;
  participants: number;
  rooms: number;
  total: number;
}

const bookings: Booking[] = [];

const router = Router();

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * GET /bookings
 * Optional: filter by userId
 */
router.get("/", (req: Request, res: Response) => {
  const { userId } = req.query;

  if (typeof userId === "string") {
    const userBookings = bookings.filter((b) => b.userId === userId);
    return res.json(userBookings);
  }

  return res.json(bookings);
});

/**
 * GET /bookings/:id
 * Get one booking by id
 */
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: "Bokningen hittades inte." });
  }

  return res.json(booking);
});

/**
 * POST /bookings
 * Create new booking
 */
router.post("/", (req: Request, res: Response) => {
  const {
    listingId,
    userId,
    date,
    startTime,
    endTime,
    participants,
    rooms,
    total,
  } = req.body;

  const effectiveUserId =
    typeof userId === "string" && userId.trim() ? userId : "demo-user-1";

  if (!listingId || !date || !startTime || !endTime) {
    return res.status(400).json({
      error: "Saknade obligatoriska fält: listingId, date, startTime, endTime",
    });
  }

  if (!participants || Number(participants) < 1) {
    return res.status(400).json({
      error: "Antal deltagare måste vara minst 1",
    });
  }

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (endMinutes <= startMinutes) {
    return res.status(400).json({
      error: "Sluttid måste vara senare än starttid.",
    });
  }

  const totalHours = (endMinutes - startMinutes) / 60;

  const newBooking: Booking = {
    id: Date.now().toString(),
    listingId,
    userId: effectiveUserId,
    kind: "conference",
    date,
    startTime,
    endTime,
    totalHours,
    from: `${date}T${startTime}`,
    to: `${date}T${endTime}`,
    participants: Number(participants),
    rooms: rooms ? Number(rooms) : 1,
    total: total ? Number(total) : 0,
  };

  bookings.push(newBooking);

  return res.status(201).json(newBooking);
});

export default router;