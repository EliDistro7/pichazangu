import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Modal from "../../components/Modal"; // Use the Modal component
import getResults from "../../utils/cachedImages"; // Fetches from your DB by eventId and mediaType
import getBase64ImageUrl from "../../utils/generateBlurPlaceholder";

interface MediaPageProps {
  currentMedia: {
    id: number;
    url: string;
    blurDataUrl?: string;
  };
  mediaUrls: string[];
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
  // photoId is the dynamic segment but here we always show the first media item.
  // You could use router.query.photoId if you decide to support other indices.
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
        {/* Replace Carousel with Modal */}
        <Modal
          mediaUrls={mediaUrls}
          mediaType={mediaType}
          onClose={() => router.push("/")} // Close modal and navigate back to home
        />
      </main>
    </>
  );
};

export default MediaPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Retrieve eventId and mediaType from the query string.
  const { eventId, mediaType } = context.query;

  // If required query parameters are missing, return a 404.
  if (!eventId || !mediaType) {
    return { notFound: true };
  }

  // Validate mediaType – default to "photo" if not "video"
  const type: "photo" | "video" = mediaType === "video" ? "video" : "photo";

  // Fetch the media URLs for the specific event and type from your database.
  // getResults returns an array of strings (URLs)
  const mediaUrls: string[] = await getResults(eventId as string, type);

 // console.log("media urls", mediaUrls);

  // Transform the array of strings into objects expected by your component.
  const reducedResults = mediaUrls.map((url, index) => ({
    id: index,
    url,
  }));

  // For this page, we want only the first media item.
  const currentMedia = reducedResults[0];

  // If it's a photo, create a blur placeholder.
  {/*
  if (type === "photo" && currentMedia) {
    currentMedia.blurDataUrl = await getBase64ImageUrl(currentMedia);
  }
    */
  }

  return {
    props: {
      currentMedia,
      eventId: eventId as string,
      mediaType: type,
      mediaUrls: mediaUrls,
    },
  };
};