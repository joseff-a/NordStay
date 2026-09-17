import { useEffect, useState } from "react";

interface SearchBarProps {
  onSubmit: (values: {
    place: string;
    from: string;
    to: string;
    participants: number;
  }) => void;
  initialPlace?: string;
  initialFrom?: string;
  initialTo?: string;
  initialParticipants?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSubmit,
  initialPlace = "",
  initialFrom = "",
  initialTo = "",
  initialParticipants = 1,
}) => {
  const [place, setPlace] = useState(initialPlace);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [participants, setParticipants] = useState(initialParticipants);

  useEffect(() => {
    setPlace(initialPlace);
  }, [initialPlace]);

  useEffect(() => {
    setFrom(initialFrom);
  }, [initialFrom]);

  useEffect(() => {
    setTo(initialTo);
  }, [initialTo]);

  useEffect(() => {
    setParticipants(initialParticipants);
  }, [initialParticipants]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      place,
      from,
      to,
      participants,
    });
  };

  return (
    <section className="w-full">
      <div className="flex justify-center px-4 pb-0">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[1052px] rounded-[10px] border border-black/40 bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-6"
        >
          <div className="grid items-stretch gap-3 md:grid-cols-[3fr_3fr_3fr_1fr]">
            <div className="h-[46px]">
              <div className="flex h-full flex-col justify-center rounded-[10px] border border-black/40 px-4 py-[4px]">
                <span className="text-[12px] font-bold leading-tight text-black">
                  Stad
                </span>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full border-none bg-transparent text-[14px] font-normal leading-tight text-black outline-none placeholder:text-gray-500"
                  placeholder="t.ex. Stockholm, Göteborg, Malmö"
                />
              </div>
            </div>

            <div className="h-[46px]">
              <div className="flex h-full gap-2">
                <div className="flex flex-1 flex-col justify-center rounded-[10px] border border-black/40 px-4 py-[4px]">
                  <span className="text-[12px] font-bold leading-tight text-black">
                    Startdatum
                  </span>
                  <input
                    type="date"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full border-none bg-transparent text-[13px] font-normal text-black outline-none"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center rounded-[10px] border border-black/40 px-4 py-[4px]">
                  <span className="text-[12px] font-bold leading-tight text-black">
                    Slutdatum
                  </span>
                  <input
                    type="date"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full border-none bg-transparent text-[13px] font-normal text-black outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="h-[46px]">
              <div className="flex h-full">
                <div className="flex w-full flex-col justify-center rounded-[10px] border border-black/40 px-4 py-[4px]">
                  <span className="text-[12px] font-bold leading-tight text-black">
                    Deltagare
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value) || 1)}
                    className="w-full border-none bg-transparent text-[15px] font-normal text-black outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="h-[46px] w-full rounded-[10px] bg-[#003082] text-[15px] font-semibold text-white transition-colors hover:bg-[#00215f]"
              >
                Sök
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SearchBar;