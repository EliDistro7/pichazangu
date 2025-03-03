import Document, { Head, Html, Main, NextScript } from "next/document";
import Header from "../components/Header";
import Footer from "../components/Footer";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="See pictures from Next.js Conf and the After Party."
          />
          <meta property="og:site_name" content="nextjsconf-pics.vercel.app" />
          <meta
            property="og:description"
            content="See pictures from Next.js Conf and the After Party."
          />
          <meta property="og:title" content="Next.js Conf 2022 Pictures" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Next.js Conf 2022 Pictures" />
          <meta
            name="twitter:description"
            content="See pictures from Next.js Conf and the After Party."
          />
        </Head>
        <body className="font-sans bg-black antialiased">
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
