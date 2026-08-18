'use client';

import Link from 'next/link';
import Logo from '@/components/atoms/Logo';
import { FOOTER_SUPPORT_LINKS } from '@/constants/navigation';
import { useCategoriesQuery } from '@/hooks/useCategories';

export default function Footer() {
  const { data: categories = [] } = useCategoriesQuery();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/products' },
    ...categories.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
    })),
  ];

  return (
    <footer className="bg-[#2A1558] text-slate-300 border-t border-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-1.5 w-fit shadow-sm border border-white/30">
              <Logo className="h-10 w-36" />
            </div>
            <p className="text-sm text-purple-200/80 leading-relaxed font-medium">
              We provide the best pets and accessories to bring joy, love and happiness to your home.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/share/1EKVxKJ8c4/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 text-white flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <i className="fa-brands fa-facebook-f text-[14px]"></i>
              </a>
              <a
                href="https://www.instagram.com/alnaderpets"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-[14px]"></i>
              </a>
              <a
                href="https://youtube.com/@alnaderpetshop9989"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-purple-600 text-white flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <i className="fa-brands fa-youtube text-[14px]"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-white/85 hover:text-white font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-white/85 hover:text-white font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <div className="flex items-start gap-3 text-sm">
              <i className="fa-solid fa-location-dot text-purple-300 mt-0.5 text-[16px] w-[16px] text-center flex-shrink-0"></i>
              <span className="font-medium text-white/90 leading-tight">
                Warsan Third - Warsan 3 - Dubai - United Arab Emirates
              </span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <i className="fa-solid fa-phone text-purple-300 mt-0.5 text-[14px] w-[16px] text-center flex-shrink-0"></i>
              <a
                href="tel:+971506767915"
                className="font-bold text-white hover:text-purple-200 transition-colors"
              >
                +971 50 676 7915
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <i className="fa-solid fa-envelope text-purple-300 mt-0.5 text-[15px] w-[16px] text-center flex-shrink-0"></i>
              <a
                href="mailto:info@alnaderpets.com"
                className="font-bold text-white hover:text-purple-200 transition-colors break-all"
              >
                info@alnaderpets.com
              </a>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <i className="fa-solid fa-clock text-purple-300 mt-0.5 text-[15px] w-[16px] text-center flex-shrink-0"></i>
              <div className="flex flex-col text-xs font-medium text-white/90 leading-normal">
                <span>Mon - Sat: 9:00 AM - 9:00 PM</span>
                <span>Sunday: 10:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-purple-900/60 my-8" />

        {/* Footer Bottom Accept Cards and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-xs text-purple-300/80 text-center md:text-left">
              © {new Date().getFullYear()} Al Nader Pets & Accessories Trading L.L.C. All Rights Reserved.
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-purple-300/60 mr-1 font-bold uppercase tracking-wider">We Accept</span>
            <div className="flex gap-1.5">
              <span className="px-2.5 py-1 bg-white text-[9px] font-black text-blue-900 rounded border border-slate-100 shadow-sm leading-none flex items-center justify-center">VISA</span>
              <span className="px-2.5 py-1 bg-white text-[9px] font-black text-red-600 rounded border border-slate-100 shadow-sm leading-none flex items-center justify-center">Mastercard</span>
              <span className="px-2.5 py-1 bg-white text-[9px] font-black text-black rounded border border-slate-100 shadow-sm leading-none flex items-center justify-center"> Pay</span>
              <span className="px-2.5 py-1 bg-[#C2FFC2] text-[9px] font-black text-black rounded shadow-sm leading-none flex items-center justify-center">tabby</span>
              <span className="px-2.5 py-1 bg-[#FFE3D1] text-[9px] font-black text-[#FF6F61] rounded shadow-sm leading-none flex items-center justify-center">tamara</span>
            </div>
          </div>

          <div className="text-[10px] text-purple-300/60">
            Designed with <i className="fa-solid fa-heart text-rose-500"></i> for pet lovers
          </div>
        </div>

      </div>
    </footer>
  );
}
