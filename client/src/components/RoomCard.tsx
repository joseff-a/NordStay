// src/components/RoomCard.tsx
import React from "react";
import type { Listing } from "../types/api";

/**
 * Simple presentational card for the Results grid.
 * Matches the Figma style:
 * - Grey rounded image
 * - Hotel name
 * - City
 * - Date line (placeholder)
 * - Rating line (placeholder)
 * - Price line(s)
 */
const RoomCard: React.FC<{ listing: Listing }> = ({ listing }) => {
  const { title, city, capacity, pricePerHour, pricePerNight } = listing;

  return (
    <div className="w-full">
      {/* Image placeholder */}
      <div className="mb-3 flex aspect-[4/3] w-full items-center justify-center rounded-[16px] bg-gray-200 text-[12px] text-gray-500">
        BILD
      </div>

      {/* Text block (copying visual structure from Figma) */}
      <div className="space-y-[2px]">
        {/* Hotel / venue name */}
        <p className="text-[15px] font-semibold text-black truncate">
          {title}
        </p>

        {/* City */}
        <p className="text-[13px] text-gray-700">{city}</p>

        {/* Date line – static placeholder to match the design */}
        <p className="text-[13px] text-gray-700">31 Okt. – 1 Nov.</p>

        {/* Rating line – static placeholder, can be upgraded later */}
        <p className="text-[13px] text-gray-700">4.7 ★</p>

        {/* Capacity info (nice for conference feel) */}
        <p className="text-[13px] text-gray-700">
          Upp till {capacity} personer
        </p>

        {/* Pricing – show per hour/night depending on what exists */}
        {pricePerNight && (
          <p className="pt-[2px] text-[14px] font-semibold text-black">
            {pricePerNight} SEK för 1 natt
          </p>
        )}

        {pricePerHour && (
          <p className="pt-[2px] text-[14px] font-semibold text-black">
            {pricePerHour} SEK per timme
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
