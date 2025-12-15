'use client';

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  // Determine which nav links to show based on role
  const getNavLinks = () => {
    if (!user) {
      // Not logged in - public links
      return [
        { href: "/", label: "Home" },
        { href: "/price-calculator", label: "Price Calculator" },
      ];
    }

    if (userProfile?.role === 'staff') {
      // Staff navigation
      return [
        { href: "/staff/dashboard", label: "Dashboard" },
        { href: "/staff/orders", label: "Orders" },
        { href: "/staff/catalog", label: "Services" },
        { href: "/staff/equipment", label: "Equipment" },
        { href: "/staff/checkouts", label: "Checkouts" },
      ];
    }

    // Student navigation (default)
    return [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/equipment", label: "Equipment" },
      { href: "/orders", label: "Orders" },
      { href: "/price-calculator", label: "Price Calculator" },
    ];
  };

  const navLinks = getNavLinks();

  async function handleLogout() {
    try {
      await logout();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-stevens-maroon font-bold text-xl">SIT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-tight">
              VA+T FabLab
            </span>
            <span className="text-white/60 text-xs">
              Stevens Institute of Technology
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all font-medium"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth Button */}
          <div className="ml-4 pl-4 border-l border-white/20">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="text-right">
                  <div className="text-white text-sm font-medium">
                    {userProfile?.name || user.email?.split('@')[0]}
                  </div>
                  {userProfile?.role && (
                    <div className="text-white/60 text-xs capitalize">
                      {userProfile.role}
                    </div>
                  )}
                </div>
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-white text-stevens-maroon rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 space-y-2 border-t border-white/20">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 text-white/90 hover:bg-white/10 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/20">
            {user ? (
              <>
                <div className="px-4 py-2 text-white/60 text-sm">
                  {userProfile?.name || user.email?.split('@')[0]}
                  {userProfile?.role && (
                    <span className="ml-2 capitalize">({userProfile.role})</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg font-semibold text-center"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block px-4 py-2 bg-white text-stevens-maroon rounded-lg font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}