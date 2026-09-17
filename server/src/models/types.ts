/**
 * Type definitions for NordStay API
 *
 * Conference-first version used in the school project.
 */

// Represents a conference venue/listing that can be booked
export interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;

  // max number of participants the venue can handle
  participants: number;

  // pricing
  pricePerDay?: number;
  pricePerHour?: number;

  // listing type
  type: "conference" | "hybrid";

  amenities: string[];
  imageUrl: string;
}

// Represents a booking made by a user
export interface Booking {
  id: string;
  listingId: string;
  userId: string;

  kind: "conference";

  // conference booking date + time
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;

  // kept for compatibility with existing frontend pages
  from: string;
  to: string;

  participants: number;
  rooms: number;
  total: number;
}

// Represents a user account
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}