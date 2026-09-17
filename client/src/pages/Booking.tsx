import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import apiClient from "../utils/apiClient";
import type { Listing } from "../types/api";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../contexts/AuthContext";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const place = searchParams.get("place") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const participantsParam = Number(searchParams.get("participants") || "1");

  const bookingDate = searchParams.get("bookingDate") || from || "";
  const startTime = searchParams.get("startTime") || "09:00";
  const endTime = searchParams.get("endTime") || "14:00";

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [openStep, setOpenStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "invoice" | "">(
    ""
  );

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
    const fetchListing = async () => {
      if (!id) {
        setError("Ingen lokal vald.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
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

  const totalHours = useMemo(() => {
    if (!startTime || !endTime) return 0;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    const diff = endMinutes - startMinutes;
    return diff > 0 ? diff / 60 : 0;
  }, [startTime, endTime]);

  const pricePerHour = listing?.pricePerHour ?? 0;
  const total = totalHours * pricePerHour;

  const formatSek = (value: number) =>
    new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value);

  const formatDateSv = (value: string) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleBackToListing = () => {
    const params = new URLSearchParams(searchParams);
    navigate(`/listing/${id}?${params.toString()}`);
  };

  const handleSelectPaymentMethod = (method: "card" | "invoice") => {
    setPaymentMethod(method);
    setOpenStep(2);
  };

  const paymentMethodLabel =
    paymentMethod === "card"
      ? "Kreditkort"
      : paymentMethod === "invoice"
      ? "Faktura"
      : "Inte vald";

  const handleCreateBooking = async () => {
    if (!listing || !user || !isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (!paymentMethod) {
      setSubmitError("Välj betalningsmetod innan du bokar.");
      setOpenStep(1);
      return;
    }

    if (!bookingDate || !startTime || !endTime || totalHours <= 0) {
      setSubmitError("Bokningsuppgifterna är inte giltiga.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const body = {
        listingId: listing.id,
        userId: user.id,
        kind: "conference",
        date: bookingDate,
        startTime,
        endTime,
        participants: participantsParam,
        rooms: 1,
        total,
      };

      const res = await apiClient.post("/bookings", body);
      navigate(`/confirmation/${res.data.id}`);
    } catch (err) {
      console.error("Failed to create booking", err);
      setSubmitError("Kunde inte skapa bokningen. Försök igen.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-[#E3ECFF] pt-1 pb-4">
          <SearchBar
            onSubmit={handleSearch}
            initialPlace={place || "Stockholm, Sverige"}
            initialFrom={from}
            initialTo={to}
            initialParticipants={participantsParam}
          />
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          <p>Laddar bokningsförfrågan...</p>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-[#E3ECFF] pt-1 pb-4">
          <SearchBar
            onSubmit={handleSearch}
            initialPlace={place || "Stockholm, Sverige"}
            initialFrom={from}
            initialTo={to}
            initialParticipants={participantsParam}
          />
        </section>

        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-red-600">{error ?? "Något gick fel."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#E3ECFF] pt-1 pb-4">
        <SearchBar
          onSubmit={handleSearch}
          initialPlace={place || "Stockholm, Sverige"}
          initialFrom={from}
          initialTo={to}
          initialParticipants={participantsParam}
        />
      </section>

      <main className="mx-auto max-w-[1123px] px-6 pt-7 pb-10">
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={handleBackToListing}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0055FF] text-[#0055FF]"
          >
            ←
          </button>

          <h1 className="text-[22px] font-semibold text-black">
            Skicka bokningsförfrågan
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.78fr] lg:items-start">
          <div className="space-y-4">
            <div className="rounded-[16px] border border-gray-400 bg-[#E3ECFF] px-5 py-5">
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 1 ? 2 : 1)}
                className="flex w-full items-center justify-between text-left"
              >
                <h2 className="text-[17px] font-semibold text-black">
                  1. Välj betalningsmetod
                </h2>
                <span className="text-[18px] text-gray-700">
                  {openStep === 1 ? "−" : "+"}
                </span>
              </button>

              {openStep === 1 && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod("card")}
                    className={`flex h-[44px] w-[270px] items-center justify-center rounded-[10px] px-4 text-center text-white transition-colors ${
                      paymentMethod === "card"
                        ? "bg-[#003082]"
                        : "bg-[#0055FF] hover:bg-[#0047d6]"
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-white">
                      Kreditkort
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPaymentMethod("invoice")}
                    className={`flex h-[44px] w-[270px] items-center justify-center rounded-[10px] px-4 text-center text-white transition-colors ${
                      paymentMethod === "invoice"
                        ? "bg-[#003082]"
                        : "bg-[#0055FF] hover:bg-[#0047d6]"
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-white">
                      Faktura
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-[16px] border border-gray-400 bg-[#E3ECFF] px-5 py-5">
              <button
                type="button"
                onClick={() => setOpenStep(openStep === 2 ? 3 : 2)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <h2 className="text-[17px] font-semibold text-black">
                    2. Lägg till betalningsmetod
                  </h2>
                  {paymentMethod && (
                    <p className="mt-1 text-[12px] text-gray-700">
                      Vald metod: {paymentMethodLabel}
                    </p>
                  )}
                </div>
                <span className="text-[18px] text-gray-700">
                  {openStep === 2 ? "−" : "+"}
                </span>
              </button>

              {openStep === 2 && (
                <div className="mt-4 rounded-[12px] border border-gray-300 bg-white px-4 py-4">
                  {paymentMethod ? (
                    <>
                      <p className="text-[14px] font-semibold text-black">
                        {paymentMethodLabel}
                      </p>
                      <p className="mt-1 text-[12px] text-gray-700">
                        Denna betalningsmetod kommer att användas när du bekräftar
                        bokningen.
                      </p>

                      <button
                        type="button"
                        onClick={() => setOpenStep(3)}
                        className="mt-4 rounded-[10px] bg-[#0055FF] px-5 py-2 text-[13px] font-semibold text-white"
                      >
                        Fortsätt
                      </button>
                    </>
                  ) : (
                    <p className="text-[13px] text-gray-700">
                      Välj först en betalningsmetod i steg 1.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[16px] border border-gray-400 bg-[#E3ECFF] px-5 py-5">
              <button
                type="button"
                onClick={() => setOpenStep(3)}
                className="flex w-full items-center justify-between text-left"
              >
                <h2 className="text-[17px] font-semibold text-black">
                  3. Bekräfta bokningen
                </h2>
                <span className="text-[18px] text-gray-700">
                  {openStep === 3 ? "−" : "+"}
                </span>
              </button>

              {openStep === 3 && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-[12px] border border-gray-300 bg-white px-4 py-4">
                    <div className="space-y-3 text-[13px] text-gray-900">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Betalningsmetod</span>
                        <span className="font-medium text-black">
                          {paymentMethodLabel}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Datum</span>
                        <span className="font-medium text-black">
                          {formatDateSv(bookingDate)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Tid</span>
                        <span className="font-medium text-black">
                          {startTime} - {endTime}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-700">Deltagare</span>
                        <span className="font-medium text-black">
                          {participantsParam} gäster
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 border-t border-gray-300 pt-3 text-[15px] font-semibold text-black">
                        <span>Totalt</span>
                        <span>{formatSek(total)} kr</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreateBooking}
                    disabled={submitting || !paymentMethod}
                    className="ml-auto block rounded-[10px] bg-[#0055FF] px-7 py-2.5 text-[14px] font-semibold text-white hover:bg-[#0047d6] disabled:opacity-60"
                  >
                    {submitting ? "Bokar..." : "Boka lokal"}
                  </button>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside>
            <div className="rounded-[16px] border border-gray-400 bg-[#E3ECFF] px-5 py-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[12px] bg-gray-200">
                  {listing.imageUrl ? (
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                      style={{ filter: "contrast(1.02) saturate(1.02)" }}
                    />
                  ) : null}
                </div>

                <div className="pt-1">
                  <h3 className="text-[16px] font-semibold leading-[1.15] text-black">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-gray-600">
                    Mötesrum / Konferens
                  </p>
                  <p className="mt-1 text-[12px] text-gray-600">★ 4.7</p>
                </div>
              </div>

              <p className="mb-5 text-[13px] text-gray-800">
                Gratis avbokning fram t.o.m. dagen innan.
              </p>

              <div className="space-y-4 text-[13px] text-gray-900">
                <div className="border-t border-[#C0D3FF] pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-gray-700">
                        Datum
                      </p>
                      <p className="mt-1 text-[14px] text-gray-900">
                        {formatDateSv(bookingDate)} kl. {startTime} - {endTime}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleBackToListing}
                      className="rounded-[10px] bg-[#0055FF] px-4 py-2 text-[12px] font-semibold text-white"
                    >
                      Ändra
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#C0D3FF] pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-gray-700">
                        Gäster
                      </p>
                      <p className="mt-1 text-[14px] text-gray-900">
                        {participantsParam} gäster
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleBackToListing}
                      className="rounded-[10px] bg-[#0055FF] px-4 py-2 text-[12px] font-semibold text-white"
                    >
                      Ändra
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#C0D3FF] pt-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.02em] text-gray-700">
                    Prisuppgifter
                  </p>
                  <div className="mt-2 flex justify-between text-[14px] text-gray-900">
                    <span>
                      {totalHours} timmar x {formatSek(pricePerHour)} kr
                    </span>
                    <span>{formatSek(total)} kr</span>
                  </div>
                </div>

                <div className="border-t border-[#C0D3FF] pt-4">
                  <div className="flex justify-between text-[16px] font-semibold text-black">
                    <span> Totalt </span>
                    <span>{formatSek(total)} kr</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Booking;