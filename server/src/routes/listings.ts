import express, { Request, Response } from "express";
import { listings } from "../data/listings";

const router = express.Router();

/**
 * GET /listings
 * Optional query param: ?q=Stockholm
 * If q is provided, filter listings by city/country/title.
 * Otherwise, return all listings.
 */
router.get("/", (req: Request, res: Response) => {
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.json(listings);
  }

  const query = q.toLowerCase();

  const filtered = listings.filter((listing) => {
    const searchable =
      `${listing.title} ${listing.city} ${listing.country}`.toLowerCase();
    return searchable.includes(query);
  });

  return res.json(filtered);
});

/**
 * GET /listings/:id
 * Returns a single listing by ID
 */
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const listing = listings.find((l) => l.id === id);

  if (!listing) {
    return res.status(404).json({ error: "Listing not found" });
  }

  return res.json(listing);
});

/**
 * POST /listings
 * Enkel CRUD för G
 */
router.post("/", (req: Request, res: Response) => {
  const {
    title,
    city,
    pricePerDay,
    pricePerHour,
    imageUrl,
    participants,
    amenities,
  } = req.body;

  if (!title || !city || (!pricePerDay && !pricePerHour)) {
    return res.status(400).json({
      error: "title, city och minst ett pris krävs",
    });
  }

  const newListing = {
    id: Date.now().toString(),
    title,
    city,
    country: "Sverige",
    participants: Number(participants) || 0,
    pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
    pricePerHour: pricePerHour ? Number(pricePerHour) : undefined,
    type: "conference" as const,
    amenities: Array.isArray(amenities) ? amenities : [],
    imageUrl: imageUrl || "",
  };

  listings.push(newListing);

  return res.status(201).json(newListing);
});

export default router;