import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Head from "next/head";
import "../styles/index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Declare gtag on the window object
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (window.gtag) {
        window.gtag("config", "G-93VR2QSX8B", { page_path: url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}

        <title>PichaZangu | Relive Events Through Photos & Videos</title>
        <meta name="description" content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu." />
        <meta name="keywords" content="photography, videography, event photos, event videos, photographers, videographers, event photography, PichaZangu" />
        <meta name="author" content="PichaZangu Team" />
        <meta name="theme-color" content="#000000" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pichazangu.store" />
        <meta property="og:site_name" content="PichaZangu" />
        <meta property="og:title" content="PichaZangu | Relive Events Through Photos & Videos" />
        <meta property="og:description" content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu." />
        <meta property="og:image" content="https://pichazangu.store/img/nyamachoma.jpg" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@PichaZangu" />
        <meta name="twitter:title" content="PichaZangu | Relive Events Through Photos & Videos" />
        <meta name="twitter:description" content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu." />
        <meta name="twitter:image" content="https://pichazangu.store/twitter-card.jpg" />
        <meta name="twitter:player" content="https://pichazangu.store/twitter-video.mp4" />
        <link rel="canonical" href="https://www.pichazangu.store/"></link>

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3024582236485351" crossOrigin="anonymous"></script>

        {/* AMP ads */}
        <script async custom-element="amp-auto-ads" src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"></script>
      </Head>

      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-93VR2QSX8B" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'G-93VR2QSX8B');
        `}
      </Script>

      <Component {...pageProps} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
