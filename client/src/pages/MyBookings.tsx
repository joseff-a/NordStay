import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import type { Booking, Listing } from "../types/api";
import { useAuth } from "../contexts/AuthContext";

const MyBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [bookingsRes, listingsRes] = await Promise.all([
          apiClient.get<Booking[]>("/bookings", {
            params: { userId: user.id },
          }),
          apiClient.get<Listing[]>("/listings"),
        ]);

        setBookings(bookingsRes.data);
        setListings(listingsRes.data);
      } catch (err) {
        console.error("Kunde inte hämta bokningar", err);
        setError("Kunde inte hämta dina bokningar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleOpenListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  const getListingInfo = (listingId: string) => {
    return listings.find((l) => l.id === listingId);
  };

  const formatDate = (value: string) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("sv-SE");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white">
        <section className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="mb-4 text-[24px] font-semibold text-black">
            Mina bokningar
          </h1>
          <p className="mb-4 text-[14px] text-gray-700">
            Du behöver logga in för att se dina bokningar.
          </p>
          <Link
            to="/auth/login"
            className="inline-block rounded-[10px] bg-[#003082] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#00215f]"
          >
            Gå till login
          </Link>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-[24px] font-semibold text-black">
          Mina bokningar
        </h1>
        <p className="text-gray-600">Laddar bokningar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-[24px] font-semibold text-black">
          Mina bokningar
        </h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-6 text-[24px] font-semibold text-black">
          Mina bokningar
        </h1>

        {bookings.length === 0 ? (
          <p className="text-[14px] text-gray-700">
            Du har inga bokningar ännu.
          </p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const listingInfo = getListingInfo(booking.listingId);

              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-[16px] border border-gray-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-black">
                      {listingInfo?.title ?? "Lokal"}
                    </p>
                    <p className="text-[13px] text-gray-700">
                      {listingInfo?.city}, {listingInfo?.country}
                    </p>
                    <p className="mt-1 text-[13px] text-gray-700">
                      {formatDate(booking.from)} – {formatDate(booking.to)} ·{" "}
                      {booking.participants} deltagare
                    </p>
                    <p className="mt-1 text-[12px] text-gray-600">
                      Bokningstyp: Konferens
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-black">
                      Totalt: {booking.total} kr
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <button
                      type="button"
                      onClick={() => handleOpenListing(booking.listingId)}
                      className="rounded-[10px] border border-[#003082] px-4 py-2 text-[13px] font-semibold text-[#003082] hover:bg-[#E3ECFF]"
                    >
                      Visa lokal
                    </button>
                    <p className="text-[11px] text-gray-500">
                      Bokningsnummer:{" "}
                      <span className="font-mono">{booking.id}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBookingsPage;