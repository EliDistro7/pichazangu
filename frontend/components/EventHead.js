import Head from "next/head";

const EventHead = ({ event }) => (
    <Head>
      <title>{event.title}</title>
      <meta name="description" content={event.description} />
      <meta property="og:title" content={event.title} />
      <meta property="og:description" content={event.description} />
      <meta property="og:image" content={event.coverPhoto} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://pichazangu.store/evento/${event._id}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={event.title} />
      <meta name="twitter:description" content={event.description} />
      <meta name="twitter:image" content={event.coverPhoto} />
    </Head>
);

export default EventHead;
