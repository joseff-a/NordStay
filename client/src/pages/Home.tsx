import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Home() {
  const navigate = useNavigate();

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
      params.set("participants", values.participants.toString());
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
        setError("Kunde inte ladda lokaler. Försök igen senare.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const featuredListings = useMemo(() => {
    const byId = new Map(allListings.map((l) => [l.id, l]));

    const curated = FEATURED_IDS
      .map((id) => byId.get(id))
      .filter(Boolean) as Listing[];

    const remaining = allListings.filter((l) => !FEATURED_IDS.includes(l.id));

    return [...curated, ...remaining].slice(0, 10);
  }, [allListings]);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#E3ECFF] pt-1 pb-4">
        <SearchBar
          onSubmit={handleSearch}
          initialPlace=""
          initialFrom=""
          initialTo=""
          initialParticipants={1}
        />
      </section>

      <section className="mx-auto w-full max-w-[1072px] px-4 pt-8 pb-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold text-[#003082]">
            Utvalda konferenslokaler för ditt nästa möte
          </h1>
        </div>

        {loading && <p className="text-gray-600">Laddar lokaler...</p>}

        {error && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && featuredListings.length === 0 && (
          <p className="text-gray-600">Inga lokaler att visa just nu.</p>
        )}

        {!loading && !error && featuredListings.length > 0 && (
          <div
            className="grid justify-center gap-x-[18px] gap-y-[60px]"
            style={{ gridTemplateColumns: "repeat(5, 200px)" }}
          >
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                city={listing.city}
                imageUrl={listing.imageUrl}
                participants={listing.participants}
                from=""
                to=""
                rating={4.7}
                pricePerDay={listing.pricePerDay}
                pricePerHour={listing.pricePerHour}
                searchQueryString=""
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;