'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/atoms/Logo';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCategoriesQuery } from '@/hooks/useCategories';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toggleCart, count } = useCart();
  const { data: categories = [] } = useCategoriesQuery();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'All Products', href: '/products' },
    ...categories.map((cat) => ({
      label: cat.name,
      href: `/category/${cat.slug}`,
    })),
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          {/* Logo */}
          <div className="flex-shrink-0 bg-white rounded-xl p-1.5 border border-slate-200/80 shadow-sm">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? 'text-purple-600 font-extrabold'
                    : 'text-slate-600 hover:text-purple-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => router.push('/search')}
              className="p-2 text-slate-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-all"
              title="Search products"
            >
              <i className="fa-solid fa-magnifying-glass text-[18px]"></i>
            </button>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-all select-none"
              title="Open Cart"
            >
              <i className="fa-solid fa-bag-shopping text-[18px]"></i>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center"
                >
                  <Avatar name={user?.name} />
                </button>

                {profileDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-20 border border-slate-100 animate-scale-in">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex w-full items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg hover:text-purple-600"
                        >
                          <i className="fa-solid fa-gear mr-2 text-slate-400"></i> Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg hover:text-purple-600"
                      >
                        <i className="fa-solid fa-box mr-2 text-slate-400"></i> My Orders
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg hover:text-purple-600"
                      >
                        <i className="fa-solid fa-user mr-2 text-slate-400"></i> Profile
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="flex w-full items-center px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-500 focus:ring-purple-500">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Cart */}
          <div className="md:hidden flex items-center gap-2">
            {/* Search Icon */}
            <button
              onClick={() => router.push('/search')}
              className="p-2 text-slate-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-all"
            >
              <i className="fa-solid fa-magnifying-glass text-[18px]"></i>
            </button>

            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-all"
            >
              <i className="fa-solid fa-bag-shopping text-[18px]"></i>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 text-slate-600 hover:text-purple-500 rounded-lg hover:bg-purple-50 transition-all"
            >
              {menuOpen ? (
                <i className="fa-solid fa-xmark text-[20px]"></i>
              ) : (
                <i className="fa-solid fa-bars text-[20px]"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1 animate-fade-in shadow-inner">

          {/* Direct nav links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive(link.href)
                  ? 'bg-purple-50 text-purple-600 font-extrabold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <hr className="border-slate-100 !my-3" />

          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={user?.name} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-800 truncate">{user?.name}</span>
                  <span className="text-xs text-slate-500 truncate">{user?.email}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    <i className="fa-solid fa-gear mr-2 text-slate-400"></i> Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <i className="fa-solid fa-box mr-2 text-slate-400"></i> My Orders
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <i className="fa-solid fa-user mr-2 text-slate-400"></i> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full">
                <Button variant="primary" className="w-full bg-purple-600 hover:bg-purple-500 focus:ring-purple-500">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
