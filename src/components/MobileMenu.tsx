import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "../utils/helpers";
import { menuItems } from "../constants/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  theme: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Backdrop - Enhanced for glassmorphism */}
      <div
        className={cn(
          "fixed inset-0 bg-black/30 backdrop-blur-lg z-40 md:hidden transition-all duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Menu Panel - Glassmorphism style */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 bottom-0 z-50 md:hidden transition-all duration-300 ease-out",
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-gray-700/30 rounded-t-2xl h-full overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/20 dark:border-gray-700/30">
            <div className="w-10 h-1 bg-gray-300/70 dark:bg-gray-600/70 rounded-full mx-auto" />
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
                      ? "bg-primary-50/70 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-800/30"
                      : "hover:bg-gray-50/60 dark:hover:bg-gray-800/40 text-gray-700 dark:text-gray-200 border border-transparent hover:border-gray-200/40 dark:hover:border-gray-700/30"
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
                        "p-2 rounded-lg transition-colors backdrop-blur-sm",
                        isActive
                          ? "bg-primary-100/60 dark:bg-primary-800/40 text-primary-600 dark:text-primary-400"
                          : "bg-gray-100/50 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-600/40"
                      )}
                    >
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>

                  <ArrowRight
                    size={20}
                    className={cn(
                      "transition-transform group-hover:translate-x-1",
                      isActive ? "text-primary-400" : "text-gray-400"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Footer - Glassmorphism style */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20 dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg">
            <p className="text-center text-sm text-gray-600/80 dark:text-gray-400/80">
              AnimePulse • Discover Amazing Anime
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
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
