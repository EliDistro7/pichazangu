import Image from "next/image";
import { useRouter } from "next/router";
import useKeypress from "react-use-keypress";
import type { MediaProps } from "../utils/types"; // renamed to reflect photos/videos
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import SharedModal from "./SharedModal";

export default function Carousel({
  index,
  currentMedia,
  mediaType,
  mediaUrls,
}: {
  index: number;
  mediaUrls: string[];
  currentMedia: MediaProps;
  mediaType: "photo" | "video";
}) {
  const router = useRouter();
  const [, setLastViewedPhoto] = useLastViewedPhoto();

  // Transform mediaUrls (string[]) into an array of objects with id and url properties
  const formattedMediaUrls = mediaUrls.map((url, id) => ({ id, url }));

  function closeModal() {
    setLastViewedPhoto(currentMedia.id);
    router.push("/", undefined, { shallow: true });
  }

  function changeMediaId(newVal: number) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {mediaType === "photo" ? (
        <button
          className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
          onClick={closeModal}
        >
          <Image
            src={currentMedia.url}
            className="pointer-events-none h-full w-full"
            alt="blurred background"
            fill
            priority={true}
          />
        </button>
      ) : (
        <button
          className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
          onClick={closeModal}
        >
          {/* For videos, you might have a poster or fallback; here we use a plain dark background */}
          <div className="pointer-events-none h-full w-full bg-black" />
        </button>
      )}
      <SharedModal
        index={index}
        changePhotoId={changeMediaId}
        mediaUrls={formattedMediaUrls} // Pass the transformed mediaUrls
        currentMedia={currentMedia}
        closeModal={closeModal}
        mediaType={mediaType}
        navigation={false}
        direction={0} // Add direction prop (required by SharedModal)
      />
    </div>
  );
}