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

  // conference-focused listing types
  type: "conference" | "hybrid";

  amenities: string[];
  imageUrl: string;
  galleryImages?: string[];
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;

  kind: "conference";

  // date + times
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;

  // kept for compatibility with existing pages
  from: string;
  to: string;

  participants: number;
  rooms: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}