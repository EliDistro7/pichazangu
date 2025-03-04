import Document, { Head, Html, Main, NextScript } from "next/document";
import Header from "../components/Header";
import Footer from "../components/Footer";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" > {/* AMP Lightning Bolt */}
        <Head>
          <link rel="icon" href="/favicon.ico" />

          {/* Primary Meta Tags */}
          <meta name="title" content="PichaZangu | Relive Events Through Photos & Videos" />
          <meta
            name="description"
            content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu."
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://pichazangu.store" />
          <meta property="og:site_name" content="PichaZangu" />
          <meta property="og:title" content="PichaZangu | Relive Events Through Photos & Videos" />
          <meta
            property="og:description"
            content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu."
          />
          <meta property="og:image" content="https://pichazangu.store/img/nyamachoma.jpg" />

          {/* Twitter Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@PichaZangu" />
          <meta name="twitter:title" content="PichaZangu | Relive Events Through Photos & Videos" />
          <meta
            name="twitter:description"
            content="Discover and relive events through high-quality photos and videos captured by talented photographers and videographers. Explore unforgettable moments at PichaZangu."
          />
          <meta name="twitter:image" content="https://pichazangu.store/twitter-card.jpg" />
          <meta name="twitter:player" content="https://pichazangu.store/twitter-video.mp4" />

          {/* Additional SEO Meta Tags */}
          <meta name="keywords" content="photography, videography, event photos, event videos, photographers, videographers, event photography, PichaZangu" />
          <meta name="author" content="PichaZangu Team" />

          {/* Google AdSense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3024582236485351"
            crossOrigin="anonymous"
          ></script>

          {/* AMP ads */}
          <script
            async
            custom-element="amp-auto-ads"
            src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js"
          ></script>
        </Head>
        <body className="font-sans bg-black antialiased">
          
          {/* AMP Auto Ads using dangerouslySetInnerHTML */}
          <div
            dangerouslySetInnerHTML={{
              __html: `<amp-auto-ads type="adsense" data-ad-client="ca-pub-3024582236485351"></amp-auto-ads>`,
            }}
          />

          <Header />
          <Main />
          <NextScript />
          <Footer />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
