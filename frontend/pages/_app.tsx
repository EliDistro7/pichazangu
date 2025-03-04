import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import "../styles/index.css";

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

      {/* Google AdSense */}
      <Script
        async
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3024582236485351"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
    </>
  );
}
