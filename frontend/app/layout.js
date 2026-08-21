import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import QueryProvider from '@/components/guards/QueryProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Al Nader Pet Shop — Premium Pet Supplies',
  description: 'Shop premium food, treats, toys, cages, and accessories for dogs, cats, and birds. Al Nader Pet Shop in Dubai, UAE.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 font-body text-slate-800 antialiased">
        <AuthProvider>
          <QueryProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
