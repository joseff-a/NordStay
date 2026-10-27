export interface Listing {
  id: string;
  title: string;
  city: string;
  country: string;

  
  participants: number;

  
  pricePerDay?: number;
  pricePerHour?: number;

  
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

export interface User {
  id: string;
  name: string;
  email: string;
}