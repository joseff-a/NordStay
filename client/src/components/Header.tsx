import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full bg-[#E3ECFF]">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between px-3 pt-5 pb-3 sm:px-3">
        <Link
          to="/"
          className="tracking-tight text-[28px] font-bold leading-none text-[#0055FF]"
          onClick={handleCloseMenu}
        >
          NordStay
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0055FF] bg-white text-[13px] font-semibold text-[#0055FF] transition-colors hover:bg-[#DCE8FF]"
          >
            SV
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0055FF] bg-white text-[#0055FF] transition-colors hover:bg-[#DCE8FF]"
            aria-label="Öppna meny"
            aria-expanded={menuOpen}
          >
            <span className="flex flex-col items-center justify-center gap-[3px]">
              <span className="h-[2px] w-4 rounded-full bg-[#0055FF]" />
              <span className="h-[2px] w-4 rounded-full bg-[#0055FF]" />
              <span className="h-[2px] w-4 rounded-full bg-[#0055FF]" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-3 top-[74px] w-[250px] rounded-[16px] border border-[#C0D3FF] bg-white p-4 shadow-lg sm:right-3">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={handleCloseMenu}
              className="rounded-[10px] px-4 py-3 text-[14px] font-medium text-gray-800 transition-colors hover:bg-[#E3ECFF]"
            >
              Startsida
            </Link>

            <Link
              to="/mybookings"
              onClick={handleCloseMenu}
              className="rounded-[10px] px-4 py-3 text-[14px] font-medium text-gray-800 transition-colors hover:bg-[#E3ECFF]"
            >
              Mina bokningar
            </Link>

            {isAuthenticated && user ? (
              <>
                <div className="rounded-[10px] bg-[#F5F8FF] px-4 py-3 text-[13px] text-gray-700">
                  Inloggad som <span className="font-semibold">{user.name}</span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-[10px] bg-[#003082] px-4 py-3 text-left text-[14px] font-semibold text-white transition-colors hover:bg-[#00215f]"
                >
                  Logga ut
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={handleCloseMenu}
                  className="rounded-[10px] px-4 py-3 text-[14px] font-medium text-gray-800 transition-colors hover:bg-[#E3ECFF]"
                >
                  Logga in
                </Link>

                <Link
                  to="/auth/register"
                  onClick={handleCloseMenu}
                  className="rounded-[10px] bg-[#003082] px-4 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#00215f]"
                >
                  Skapa konto
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;