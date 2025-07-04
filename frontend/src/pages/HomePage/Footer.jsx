import React from "react";
import PropTypes from "prop-types";

/**
 * Renders the footer for the website.
 * Contains copyright information, branding, and key navigation links.
 */
const Footer = () => {
  const footerLinks = [
    { name: "Pricing", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <a href="#" className="text-xl font-bold text-foreground">
              Leaseify
            </a>
            <p className="text-sm text-muted-foreground">
              {/* Using the current year, 2025, for the copyright notice */}
              &copy; 2025 Leaseify Inc. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex gap-x-6">
            {legalLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Built with passion and code.
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {};

export default Footer;
