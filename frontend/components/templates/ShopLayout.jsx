import AnnouncementBar from '@/components/atoms/AnnouncementBar';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import CartDrawer from '@/components/organisms/CartDrawer';

export default function ShopLayout({ children, fullWidth = false }) {
  return (
    <div className="flex flex-col min-h-screen bg-cream-50">
      <AnnouncementBar />
      <Navbar />
      
      <main className={`flex-grow w-full mx-auto py-8 ${
        fullWidth
          ? 'px-4 sm:px-6 lg:px-8'
          : 'max-w-7xl px-4 sm:px-6 lg:px-8'
      }`}>
        {children}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
