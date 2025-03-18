

import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Modal from "../../components/Modal"; // Use the Modal component
import getResults from "../../utils/cachedImages"; // Fetches from your DB by eventId and mediaType

interface MediaItem {
  id: number;
  url: string;
  caption?: string;
  blurDataUrl?: string;
}

interface MediaPageProps {
  currentMedia: MediaItem;
  mediaUrls: MediaItem[];
  eventId: string;
  mediaType: "photo" | "video";
}

const MediaPage: NextPage<MediaPageProps> = ({
  currentMedia,
  eventId,
  mediaType,
  mediaUrls,
}) => {
  const router = useRouter();
  const index = Number(router.query.photoId) || 0;
  const currentMediaUrl = currentMedia.url;

  return (
    <>
      <Head>
        <title>{`Event ${eventId} ${mediaType === "video" ? "Videos" : "Photos"}`}</title>
        <meta property="og:image" content={currentMediaUrl} />
        <meta name="twitter:image" content={currentMediaUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
      <Modal
  eventId={eventId}
  mediaUrls={mediaUrls.map((media) => media.url)} // Convert to string[]
  mediaType={mediaType}
  onClose={() => router.push(`/evento/${eventId}`)} // Close modal and navigate back to home
/>

      </main>
    </>
  );
};

export default MediaPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { eventId, mediaType } = context.query;

  if (!eventId || !mediaType) {
    return { notFound: true };
  }

  const type: "photo" | "video" = mediaType === "video" ? "video" : "photo";
  const rawMedia: (string | { url: string; caption?: string })[] = await getResults(eventId as string, type);

  const mediaUrls: MediaItem[] = rawMedia.map((media, index) =>
    typeof media === "string" ? { id: index, url: media } : { id: index, url: media.url, caption: media.caption || "" }
  );

  const currentMedia = mediaUrls[0];

  return {
    props: {
      currentMedia,
      eventId: eventId as string,
      mediaType: type,
      mediaUrls,
    },
  };
};
