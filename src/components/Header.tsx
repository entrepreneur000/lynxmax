import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/privacy", label: "Privacy" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/20 dark:border-gray-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-3xl">🐆</span>
          <span className="text-xl font-bold text-primary">
            Lynxmax
          </span>
        </Link>
        
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Mobile burger menu button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden glass-card border-t border-white/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
