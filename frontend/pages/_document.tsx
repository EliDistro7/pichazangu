import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Theme Color for Dark Mode */}
          <meta name="theme-color" content="#000000" />

          {/* Google AdSense */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3024582236485351"
            crossOrigin="anonymous"
          ></script>

         
        </Head>
        <body className="font-sans bg-black antialiased">
          {/* AMP Auto Ads */}
          <div
            dangerouslySetInnerHTML={{
              __html: `<amp-auto-ads type="adsense" data-ad-client="ca-pub-3024582236485351"></amp-auto-ads>`,
            }}
          />

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
