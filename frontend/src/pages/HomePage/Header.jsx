import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import PropTypes from "prop-types";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
// import { useTheme } from "@/components/ThemeProvider"; // Make sure this path matches your project
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * Renders the main navigation header for the landing page.
 * Now fully supports both light and dark themes with proper contrast.
 */
const Header = () => {
  const { theme } = useTheme(); // Get current theme

  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 sm:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-foreground"
        >
          <Building2 className="h-6 w-6" />
          <span className="text-xl">Leaseify</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="transition-colors hover:text-foreground"
          >
            Testimonials
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton />

          <Button
            variant="ghost"
            className="hidden sm:inline-flex text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            asChild
          >
            <Link to="/login">Login</Link>
          </Button>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link to="/register">Signup</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {};

export default Header;
