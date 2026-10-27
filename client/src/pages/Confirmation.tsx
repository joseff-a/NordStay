import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const handleGoToBookings = () => {
    navigate("/bookings/me");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="rounded-[16px] border border-[#C0D3FF] bg-[#E3ECFF] px-8 py-10 text-center">
          <div className="mb-4 text-4xl"></div>
          <h1 className="mb-3 text-[24px] font-semibold text-black">
            Din bokning är bekräftad
          </h1>
          <p className="mb-1 text-[14px] text-gray-800">
            Tack för att du bokar med NordStay.
          </p>
          {bookingId && (
            <p className="mb-4 text-[12px] text-gray-600">
              Bokningsnummer:{" "}
              <span className="font-mono">{bookingId}</span>
            </p>
          )}

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={handleGoToBookings}
              className="w-full sm:w-auto rounded-[10px] bg-[#003082] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#00215f]"
            >
              Visa mina bokningar
            </button>
            <button
              type="button"
              onClick={handleBackHome}
              className="w-full sm:w-auto rounded-[10px] border border-[#003082] px-6 py-2.5 text-[14px] font-semibold text-[#003082] hover:bg-[#E3ECFF]"
            >
              Till startsidan
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
