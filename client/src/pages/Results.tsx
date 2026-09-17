import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ListingCard from "../components/ListingCard";
import apiClient from "../utils/apiClient";
import type { Listing } from "../types/api";

const FEATURED_IDS: string[] = [
  // Stockholm
  "nordic-light-hotel",
  "at-six",
  "clarion-sign",
  "radisson-blu-waterfront",

  // Göteborg
  "clarion-hotel-post",
  "radisson-blu-scandinavia-goteborg",
  "gothia-towers",

  // Malmö
  "clarion-hotel-malmo-live",
  "radisson-blu-hotel-malmo",
  "best-western-malmo-arena-hotel",
];

const Results = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const place = searchParams.get("place") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const participantsParam = Number(searchParams.get("participants") || "0");
  const currentQueryString = searchParams.toString();

  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.get<Listing[]>("/listings");
        setAllListings(res.data);
      } catch (err) {
        console.error("Failed to load listings", err);
        setError("Kunde inte ladda konferenslokaler. Försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const cityFromPlace =
    place && place.includes(",")
      ? place.split(",")[0].trim()
      : place.trim();

  const featuredListings = useMemo(() => {
    const byId = new Map(allListings.map((l) => [l.id, l]));

    const curated = FEATURED_IDS
      .map((id) => byId.get(id))
      .filter(Boolean) as Listing[];

    const remaining = allListings.filter((l) => !FEATURED_IDS.includes(l.id));

    return [...curated, ...remaining].slice(0, 10);
  }, [allListings]);

  const filteredListings: Listing[] = useMemo(() => {
    let result = allListings;

    if (cityFromPlace) {
      result = result.filter((l) =>
        l.city.toLowerCase().includes(cityFromPlace.toLowerCase())
      );
    }

    if (participantsParam > 0) {
      result = result.filter((l) => l.participants >= participantsParam);
    }

    return result;
  }, [allListings, cityFromPlace, participantsParam]);

  const isFeaturedMode = cityFromPlace.length === 0;
  const listingsToShow = isFeaturedMode ? featuredListings : filteredListings;

  return (
    <div className="bg-white">
      <section className="bg-[#E3ECFF] pt-1 pb-4">
        <SearchBar
          onSubmit={handleSearch}
          initialPlace={place || "t.ex. Stockholm, Göteborg, Malmö."}
          initialFrom={from}
          initialTo={to}
          initialParticipants={participantsParam > 0 ? participantsParam : 1}
        />
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        {isFeaturedMode ? (
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Utvalda konferenslokaler
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Våra rekommendationer just nu
            </p>
          </div>
        ) : (
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-[#003082]">
              Konferenslokaler i {place}
            </h1>
          </div>
        )}

        {loading && <p className="text-gray-600">Laddar lokaler...</p>}

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && listingsToShow.length === 0 && (
          <p className="text-gray-600">
            Inga lokaler hittades för den här sökningen.
          </p>
        )}

        {!loading && !error && listingsToShow.length > 0 && (
          <div
            className="grid justify-center gap-x-[18px] gap-y-[60px]"
            style={{ gridTemplateColumns: "repeat(5, 200px)" }}
          >
            {listingsToShow.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                city={listing.city}
                imageUrl={listing.imageUrl}
                participants={listing.participants}
                from={from}
                to={to}
                rating={4.7}
                pricePerDay={listing.pricePerDay}
                pricePerHour={listing.pricePerHour}
                searchQueryString={currentQueryString}
              />
            ))}
          </div>
        )}

        {!loading && !error && isFeaturedMode && featuredListings.length < 10 && (
          <p className="mt-8 text-sm text-gray-500">
            Tips: Kontrollera att dina featured-ID:n finns i seed-datan.
          </p>
        )}
      </section>
    </div>
  );
};

export default Results;