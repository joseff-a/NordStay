import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import type { Listing } from "../types/api";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../contexts/AuthContext";

const ListingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const place = searchParams.get("place") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const participantsParam = Number(searchParams.get("participants") || "0");
  const resultsQueryString = searchParams.toString();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingDate, setBookingDate] = useState(from || "");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("14:00");
  const [participants, setParticipants] = useState(
    participantsParam > 0 ? participantsParam : 1
  );
  const [bookingError, setBookingError] = useState<string | null>(null);

  
  const handleSearch = (values: {
    place: string;
    from: string;
    to: string;
    participants: number;
  }) => {
    const params = new URLSearchParams();

    if (values.place) params.set("place", values.place);
    if (values.from) params.set("from", values.from);
    if (values.to) params.set("to", values.to);
    if (values.participants) {
      params.set("participants", String(values.participants));
    }

    navigate(`/results?${params.toString()}`);
  };

  useEffect(() => {
    if (from) {
      setBookingDate(from);
    }
  }, [from]);

  useEffect(() => {
    setParticipants(participantsParam > 0 ? participantsParam : 1);
  }, [participantsParam]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setError("Ingen id angiven.");
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get<Listing>(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error("Failed to load listing", err);
        setError("Kunde inte ladda lokalen.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBack = () => {
    if (resultsQueryString) {
      navigate(`/results?${resultsQueryString}`);
      return;
    }

    navigate(-1);
  };

  const formatSek = (value: number) =>
    new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value);

  const galleryImages = useMemo(() => {
  if (!listing) return [];

  if (listing.galleryImages && listing.galleryImages.length > 0) {
    return listing.galleryImages;
  }

  if (!listing.imageUrl) return [];

  return [
    listing.imageUrl,
    listing.imageUrl,
    listing.imageUrl,
    listing.imageUrl,
    listing.imageUrl,
  ];
}, [listing]);

  const selectedImage = galleryImages[0] || listing?.imageUrl || "";

  const priceValue =
    typeof listing?.pricePerHour === "number"
      ? listing.pricePerHour
      : listing?.pricePerDay;

  const priceUnitText =
    typeof listing?.pricePerHour === "number" ? "per timme" : "per dag";

  const infoPills = useMemo(() => {
    if (!listing) return [];

    const pricePill =
      typeof listing.pricePerHour === "number"
        ? `${formatSek(listing.pricePerHour)} kr/tim`
        : typeof listing.pricePerDay === "number"
        ? `${formatSek(listing.pricePerDay)} kr/dag`
        : "Pris på förfrågan";

    return [
      "Konferenslokal",
      "Mötesrum",
      "Wi-Fi",
      `Upp till ${listing.participants} deltagare`,
      "Centralt läge",
      pricePill,
    ];
  }, [listing]);


  const calculateHours = () => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const diff = endMinutes - startMinutes;
    return diff > 0 ? diff / 60 : 0;
  };

  const handleBook = () => {
    if (!listing) return;

    if (!isAuthenticated || !user) {
      navigate("/auth/login");
      return;
    }

    if (!bookingDate) {
      setBookingError("Välj datum innan du fortsätter.");
      return;
    }

    if (!startTime || !endTime) {
      setBookingError("Välj starttid och sluttid.");
      return;
    }

    const totalHours = calculateHours();

    if (totalHours <= 0) {
      setBookingError("Sluttid måste vara senare än starttid.");
      return;
    }

    if (participants < 1) {
      setBookingError("Antalet deltagare måste vara minst 1.");
      return;
    }

    if (participants > listing.participants) {
      setBookingError(
        `Max antal deltagare för denna lokal är ${listing.participants}.`
      );
      return;
    }

    setBookingError(null);

    const params = new URLSearchParams(searchParams);
    params.set("bookingDate", bookingDate);
    params.set("startTime", startTime);
    params.set("endTime", endTime);
    params.set("participants", String(participants));

    navigate(`/booking/${listing.id}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="bg-white">
        <section className="bg-[#E3ECFF] pt-1 pb-4">
          <SearchBar
            onSubmit={handleSearch}
            initialPlace={place || "Stockholm, Sverige"}
            initialFrom={from}
            initialTo={to}
            initialParticipants={participantsParam > 0 ? participantsParam : 1}
          />
        </section>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p>Laddar lokal...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="bg-white">
        <section className="bg-[#E3ECFF] pt-1 pb-4">
          <SearchBar
            onSubmit={handleSearch}
            initialPlace={place || "Stockholm, Sverige"}
            initialFrom={from}
            initialTo={to}
            initialParticipants={participantsParam > 0 ? participantsParam : 1}
          />
        </section>
        <div className="mx-auto max-w-6xl px-6 py-10">
          <button
            onClick={handleBack}
            className="mb-4 rounded-full border-2 border-[#0055FF] px-3 py-1 text-sm text-[#0055FF]"
          >
            ← Tillbaka
          </button>
          <p className="text-red-600">{error ?? "Lokalen kunde inte hittas."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <section className="bg-[#E3ECFF] pt-1 pb-4">
        <SearchBar
          onSubmit={handleSearch}
          initialPlace={place || "Stockholm, Sverige"}
          initialFrom={from}
          initialTo={to}
          initialParticipants={participantsParam > 0 ? participantsParam : 1}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0055FF] text-[#0055FF]"
          >
            ←
          </button>

          <h1 className="text-[24px] font-semibold text-black">
            {listing.title}
          </h1>
        </div>

        <div className="mx-auto max-w-[1123px]">
          <div className="grid gap-[8px] lg:grid-cols-[563px_552px] lg:items-start">
            <div className="overflow-hidden rounded-[16px] bg-gray-200">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={listing.title}
                  className="h-[280px] w-full object-cover sm:h-[340px] lg:h-[390px]"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-gray-600 sm:h-[340px] lg:h-[386px]">
                  BILD
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-[8px]">
              {Array.from({ length: 4 }).map((_, index) => {
                const image = galleryImages[index + 1] || "";

                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[16px] bg-gray-200"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={`${listing.title} bild ${index + 2}`}
                        className="h-[136px] w-full object-cover sm:h-[170px] lg:h-[189px]"
                      />
                    ) : (
                      <div className="flex h-[136px] items-center justify-center text-xs text-gray-600 sm:h-[170px] lg:h-[189px]">
                        BILD
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-[20px] grid gap-[20px] lg:grid-cols-[563px_552px] lg:items-start">
            <div>
              <div className="w-full max-w-[561px] rounded-[16px] border border-black bg-white p-[8px]">
                <div className="grid grid-cols-3 gap-[8px]">
                  {infoPills.map((pill) => (
                    <div
                      key={pill}
                      className="flex h-[30px] w-[174px] items-center justify-center rounded-[10px] border border-black bg-white px-2 text-center text-[12px] font-medium leading-none text-black"
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[20px] max-w-[561px] space-y-4 text-left text-[14px] leading-6 text-gray-800">
                <p>
                  {listing.title} ligger i {listing.city} och passar för möten,
                  konferenser och företagsevent.
                </p>

                <p>
                  Lokalen har plats för upp till {listing.participants} deltagare
                  och erbjuder en professionell miljö för workshops, presentationer
                  och teammöten.
                </p>

                <p>
                  Här finns en flexibel lokal med bekvämligheter som stödjer både
                  mindre möten och större affärssammanhang i en modern miljö.
                </p>
              </div>
            </div>

            <div className="flex lg:justify-end lg:mr-[8px]">
              <div className="w-full max-w-sm rounded-[16px] border border-[#C0D3FF] bg-[#E3ECFF] px-6 py-6">
                <div className="mb-4">
                  {priceValue && (
                    <p className="text-[18px] font-semibold text-black">
                      {formatSek(priceValue)} kr{" "}
                      <span className="text-[14px]">{priceUnitText}</span>
                    </p>
                  )}
                </div>

                <div className="mb-3 flex flex-col rounded-[10px] border border-gray-300 bg-white px-3 py-2">
                  <span className="text-[11px] font-semibold">Datum</span>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-[2px] bg-transparent text-[13px] outline-none"
                  />
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <div className="flex flex-col rounded-[10px] border border-gray-300 bg-white px-3 py-2">
                    <span className="text-[11px] font-semibold">Starttid</span>
                    <input
                      type="time"
                      step={3600}
                      min="07:00"
                      max="22:00"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="mt-[2px] bg-transparent text-[13px] outline-none"
                    />
                  </div>

                  <div className="flex flex-col rounded-[10px] border border-gray-300 bg-white px-3 py-2">
                    <span className="text-[11px] font-semibold">Sluttid</span>
                    <input
                      type="time"
                      step={3600}
                      min="08:00"
                      max="23:00"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="mt-[2px] bg-transparent text-[13px] outline-none"
                    />
                  </div>
                </div>

                <div className="mb-4 flex flex-col rounded-[10px] border border-gray-300 bg-white px-3 py-2">
                  <span className="text-[11px] font-semibold">Deltagare</span>
                  <input
                    type="number"
                    min={1}
                    max={listing.participants}
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value) || 1)}
                    className="mt-[2px] bg-transparent text-[13px] outline-none"
                  />
                </div>

                <button
                  onClick={handleBook}
                  className="w-full rounded-[10px] bg-[#003082] py-3 text-[15px] font-semibold text-white"
                >
                  Fortsätt
                </button>

                {bookingError && (
                  <p className="mt-2 text-center text-[12px] text-red-600">
                    {bookingError}
                  </p>
                )}

                <p className="mt-2 text-center text-[11px] text-gray-700">
                  
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListingPage;