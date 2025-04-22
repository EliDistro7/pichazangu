import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";


class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* Theme Color for Dark Mode */}
          <meta name="theme-color" content="#000000" />

          {/* Google AdSense - Using Next.js Script component */}
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3024582236485351"
            crossOrigin="anonymous"
          />

       
        </Head>
        <body className="font-sans bg-black antialiased ">
          {/* AMP Auto Ads placeholder - only if using AMP */}
          {process.env.NEXT_PUBLIC_AMP === 'true' && (
            <div
              dangerouslySetInnerHTML={{
                __html: `<amp-auto-ads type="adsense" data-ad-client="ca-pub-3024582236485351"></amp-auto-ads>`,
              }}
            />
          )}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;