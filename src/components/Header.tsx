import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../utils/helpers";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { menuItems } from "../constants/navigation";

interface HeaderProps {
  showBackButton?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  title = "",
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowMobileSearch(false);
  };

  const handleSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md dark:bg-gray-900/90 shadow-sm border-b border-gray-200/50 dark:border-gray-700/30">
        <div className="container-custom flex h-16 items-center justify-between px-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBackButton ? (
              <button onClick={() => navigate(-1)} className="md:hidden">
                <ChevronLeft size={24} />
              </button>
            ) : (
              <Link
                to="/"
                className="flex items-center gap-1 text-xl font-bold"
              >
                <span className="text-primary-600 dark:text-primary-400">
                  Anime
                </span>
                <span className="text-gray-800 dark:text-gray-200">Pulse</span>
              </Link>
            )}
            {title && (
              <h1 className="text-lg font-semibold md:hidden">{title}</h1>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors",
                  location.pathname === item.path &&
                    "text-primary-600 dark:text-primary-500"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle - Visible on both mobile and desktop */}
            <button
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                <Moon
                  size={20}
                  className={cn(
                    "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] transform",
                    "text-gray-700 dark:text-gray-300",
                    theme === "light"
                      ? "rotate-0 opacity-100 scale-100"
                      : "-rotate-180 opacity-0 scale-50 translate-x-3 -translate-y-2"
                  )}
                />
                <Sun
                  size={20}
                  className={cn(
                    "absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] transform",
                    "text-amber-500 dark:text-yellow-300",
                    theme === "dark"
                      ? "rotate-0 opacity-100 scale-100"
                      : "rotate-180 opacity-0 scale-50 -translate-x-3 translate-y-2"
                  )}
                />
              </div>
            </button>

            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <SearchBar
                isMobile
                showMobileSearch={showMobileSearch}
                onToggle={handleSearchToggle}
              />

              {/* Enhanced Animated Hamburger Menu */}
              <button
                onClick={handleMenuToggle}
                className="relative flex flex-col items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-5">
                  <span
                    className={cn(
                      "absolute top-0 left-0 w-full h-[2px] bg-gray-800 dark:bg-gray-200",
                      "transition-all duration-300 origin-center",
                      isMenuOpen ? "rotate-45 top-[9px]" : "top-0"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 w-full h-[2px] bg-gray-800 dark:bg-gray-200",
                      "transition-all duration-300",
                      isMenuOpen
                        ? "opacity-0 scale-x-0"
                        : "opacity-100 scale-x-100 top-[7px]"
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 w-full h-[2px] bg-gray-800 dark:bg-gray-200",
                      "transition-all duration-300 origin-center",
                      isMenuOpen ? "-rotate-45 top-[9px]" : "top-[14px]"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Removed theme toggle from here since it's now in header */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    </>
  );
};

export default Header;
