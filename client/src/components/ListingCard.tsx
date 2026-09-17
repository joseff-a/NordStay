import { Link } from "react-router-dom";

type Props = {
  id: string;
  title: string;
  city: string;
  imageUrl: string;
  participants: number;
  from?: string;
  to?: string;
  rating?: number;
  pricePerDay?: number;
  pricePerHour?: number;
  searchQueryString?: string;
};

const MONTHS_SV_SHORT = [
  "Jan.",
  "Feb.",
  "Mars",
  "Apr.",
  "Maj",
  "Juni",
  "Juli",
  "Aug.",
  "Sep.",
  "Okt.",
  "Nov.",
  "Dec.",
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatSvDate(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  const month = MONTHS_SV_SHORT[m - 1] ?? "";
  return `${pad2(d)} ${month}`;
}

function formatSvDateRange(from?: string, to?: string) {
  if (!from || !to) return "";
  const a = formatSvDate(from);
  const b = formatSvDate(to);
  if (!a || !b) return "";
  return `${a} - ${b}`;
}

function formatNumberComma(n: number) {
  return new Intl.NumberFormat("sv-SE", {
    maximumFractionDigits: 0,
  }).format(n);
}

const ListingCard = ({
  id,
  title,
  city,
  imageUrl,
  participants,
  from,
  to,
  rating = 4.7,
  pricePerDay,
  pricePerHour,
  searchQueryString = "",
}: Props) => {
  const dateLine = formatSvDateRange(from, to);

  const priceValue =
    typeof pricePerHour === "number" ? pricePerHour : pricePerDay;

  const priceUnitText =
    typeof pricePerHour === "number" ? "per timme" : "per dag";

  const listingUrl = searchQueryString
    ? `/listing/${id}?${searchQueryString}`
    : `/listing/${id}`;

  return (
    <Link to={listingUrl} className="block">
      <article
        className="h-[280px] w-[200px] text-left font-sans"
        aria-label={title}
      >
        <div className="h-[165px] w-[200px] overflow-hidden rounded-[10px] bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover"
              style={{
                filter: "contrast(1.03) saturate(1.02)",
              }}
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>

        <div className="flex flex-col gap-[2px] pl-[7px] pt-[8px]">
          <h3
            className="line-clamp-2 text-[14px] font-bold leading-[18px] text-gray-900"
            title={title}
          >
            {title}
          </h3>

          <p className="text-[12px] font-normal leading-[16px] text-gray-900">
            {city}
          </p>

          <p className="text-[12px] font-normal leading-[16px] text-gray-900">
            Upp till {participants} deltagare
          </p>

          {dateLine && (
            <p className="text-[12px] font-normal leading-[16px] text-gray-900">
              {dateLine}
            </p>
          )}

          <p className="text-[12px] font-normal leading-[16px] text-gray-900">
            {rating.toFixed(1)} <span>★</span>
          </p>

          {typeof priceValue === "number" && priceValue > 0 && (
            <p className="mt-[3px] text-[13px] leading-[18px] text-gray-900">
              <span className="font-bold">
                {formatNumberComma(priceValue)} kr
              </span>{" "}
              <span className="font-medium">{priceUnitText}</span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ListingCard;