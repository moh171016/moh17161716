import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import SiteHeader from '@/components/SiteHeader';
import WhatsAppSupport from '@/components/WhatsAppSupport';
import StoreFooter from '@/components/StoreFooter';
import { getDb } from '@/lib/mongodb';
import MobileBottomNav from '@/components/MobileBottomNav';

export async function generateMetadata(): Promise<Metadata> {
  let projectName = 'أرض الجوال';
  if (process.env.MONGODB_URI) {
    try {
      const db = await getDb();
      const brand = await db.collection<{ _id: string; projectName?: string }>('store_settings').findOne({ _id: 'brand' });
      if (typeof brand?.projectName === 'string' && brand.projectName.trim()) {
        projectName = brand.projectName.trim();
      }
    } catch {
      // Keep the default metadata if the settings database is temporarily unavailable.
    }
  }

  return {
    title: projectName + ' | متجر الجوالات والإكسسوارات',
    description: projectName + ' — تصفح الجوالات والأجهزة وملحقاتها واختر المنتجات التي تناسبك.',
    applicationName: projectName
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="mobile-app-shell">
          <CartProvider>
            <SiteHeader />
            {children}
            <StoreFooter />
            <WhatsAppSupport />
            <MobileBottomNav />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
