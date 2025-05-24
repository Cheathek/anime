import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, ChevronRight } from "lucide-react";
import { cn } from "../utils/helpers";
import { menuItems } from "../constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  theme: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  toggleTheme,
  theme,
}) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bottom-0 z-50 md:hidden transition-all duration-300 ease-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl rounded-t-2xl h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto" />
          </div>

          {/* Menu Items */}
          <nav className="px-6 py-4 space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[0.98] active:scale-95",
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                  )}
                  onClick={onClose}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: isOpen
                      ? "slideInFromRight 0.3s ease-out forwards"
                      : undefined,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary-100 dark:bg-primary-800/50 text-primary-600 dark:text-primary-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>

                  <ChevronRight
                    size={20}
                    className={cn(
                      "transition-transform group-hover:translate-x-1",
                      isActive ? "text-primary-400" : "text-gray-400"
                    )}
                  />
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                onClose();
              }}
              className="group w-full flex items-center justify-between p-4 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[0.98] active:scale-95"
              style={{
                animationDelay: `${menuItems.length * 50}ms`,
                animation: isOpen
                  ? "slideInFromRight 0.3s ease-out forwards"
                  : undefined,
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <span className="text-lg font-medium">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-200",
                    theme === "dark" ? "bg-primary-500" : "bg-gray-300"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                      theme === "dark" ? "translate-x-6" : "translate-x-0"
                    )}
                  />
                </div>
              </div>
            </button>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              AnimePulse • Discover Amazing Anime
            </p>
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
