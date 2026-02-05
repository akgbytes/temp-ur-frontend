import { Geist, Geist_Mono } from "next/font/google";
import BootstrapLoader from "@/components/BootstrapLoader";
import ErrorBoundary from "@/components/ErrorBoundaryFallback";
import MobileNav from "@/components/MobileNav";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomeVideo from "@/components/HomeVideo";
import ScrollToTop from "@/components/ScrollToTop";
import { LocationProvider } from "@/contexts/LocationContext";
import { ImageCacheProvider } from "@/contexts/ImageCacheContext";
import { Auth2FactorProvider } from "@/contexts/Auth2FactorContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { PropertiesProvider } from "@/contexts/PropertiesContext";
import GlobalAnalyticsTracker from "@/components/GlobalAnalyticsTracker";
import "./globals.css";
import "../styles/skeleton.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Urbanesta - Find Your Dream Property in India",
  description: "Discover premium residential and commercial properties across India. Find apartments, villas, plots, and commercial spaces from top builders.",
  icons: {
    icon: [
      { url: '/img/logo.jpg?v=2', type: 'image/jpeg' },
    ],
    shortcut: '/img/logo.jpg?v=2',
    apple: '/img/logo.jpg?v=2',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Favicon - Multiple formats for browser compatibility with cache busting */}
        <link rel="icon" href="/img/logo.jpg?v=2" type="image/jpeg" />
        <link rel="shortcut icon" href="/img/logo.jpg?v=2" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/img/logo.jpg?v=2" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/img/logo.jpg?v=2" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/img/logo.jpg?v=2" />
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Auth2FactorProvider>
          <LocationProvider>
            <ImageCacheProvider>
              <WatchlistProvider>
                <PropertiesProvider>
                  <ErrorBoundary>
                    <GlobalAnalyticsTracker />
                    <BootstrapLoader />
                    {children}
                    <MobileNav />
                    <WhatsAppButton />
                    <HomeVideo />
                    <ScrollToTop />
                  </ErrorBoundary>
                </PropertiesProvider>
              </WatchlistProvider>
            </ImageCacheProvider>
          </LocationProvider>
        </Auth2FactorProvider>
        
        {/* Bootstrap JS Bundle with Popper (for interactive components) */}
        <script 
          src="/js/bootstrap.bundle.min.js" 
          async
        />
      </body>
    </html>
  );
}
