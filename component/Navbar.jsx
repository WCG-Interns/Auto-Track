import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkStyle =
    "transition duration-200 ease-in-out hover:scale-105 px-3 py-1";
  const activeStyle = "text-blue-500 font-semibold underline underline-offset-4";
  const inactiveStyle = "text-white";

  const menuLinkStyle =
    "block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition duration-200";
  const menuActiveStyle = "font-semibold text-blue-500";

  const dashboardLink = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-gray-800 px-8 py-4 rounded-b-[20px] flex justify-between items-center z-50 shadow-lg">
        {token ? (
          <>
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none hover:cursor-pointer"
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              <h1 className="text-2xl font-extrabold text-white tracking-wide font-[Poppins]">
                🚗 KG Vehicles
              </h1>
            </div>

            {/* Slide-out Menu */}
            {menuOpen && (
              <div className="absolute top-16 left-0 w-48 bg-white/70 backdrop-blur-md border border-white/30 shadow-lg rounded-r-lg z-50">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${menuLinkStyle} ${isActive ? menuActiveStyle : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `${menuLinkStyle} ${isActive ? menuActiveStyle : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </NavLink>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `${menuLinkStyle} ${isActive ? menuActiveStyle : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </NavLink>
                <NavLink
                  to={dashboardLink}
                  className={({ isActive }) =>
                    `${menuLinkStyle} ${isActive ? menuActiveStyle : ""}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
              </div>
            )}

            {/* Right: Profile + Hello + Logout */}
            <div className="flex items-center gap-3 text-white">
              <FaUserCircle size={24} />
              <span>Hello, {user?.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Left: Logo */}
            <h1 className="text-2xl font-extrabold text-white tracking-wide font-[Poppins]">
              🚗 AutoTrack
            </h1>

            {/* Right: Links */}
            <ul className="flex gap-8 font-medium text-white text-lg">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
                  }
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${linkStyle} ${isActive ? activeStyle : inactiveStyle}`
                  }
                >
                  Login
                </NavLink>
              </li>
            </ul>
          </>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[55px]"></div>
    </>
  );
};

export default Navbar;


