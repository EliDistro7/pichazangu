import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "../utils/animationVariants";
import downloadPhoto from "../utils/downloadPhoto";
import { range } from "../utils/range";
import Twitter from "./Icons/Twitter";
import VideoThumbnail from "react-video-thumbnail"; // Import VideoThumbnail

export default function SharedModal({
  index,
  mediaUrls,
  mediaType,
  changePhotoId,
  closeModal,
  navigation,
  currentMedia, // Represents the current media object
  direction,
}: {
  index: number;
  mediaUrls: { id: number; url: string }[];
  mediaType: "photo" | "video";
  changePhotoId: (newIndex: number) => void;
  closeModal: () => void;
  navigation: boolean;
  currentMedia: { id: number; url: string };
  direction: number;
}) {
  const [loaded, setLoaded] = useState(false);

  // Filter mediaUrls to only include items within a range of the current index
  const filteredMedia = mediaUrls.filter((media) =>
    range(index - 15, index + 15).includes(media.id)
  );

  // Swipe handlers for touch and mouse events
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < mediaUrls.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });
  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-[1000] mx-0 flex w-full max-w-7xl aspect-[3/2]  lg:mt-48 lg:mb-20 xl:mt-60 xl:mb-24 wide:h-full xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main Media Display */}
        <div className="w-full h-full overflow-hidden mx-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full h-full flex items-center justify-center"
              >
                {mediaType === "photo" ? (
                  <Image
                    src={currentMedia.url}
                    width={navigation ? 1280 : 1920}
                    height={navigation ? 853 : 1280}
                    priority
                    alt={`Event media ${currentMedia.id}`}
                    placeholder="blur"
                    blurDataURL={currentMedia.url}
                    onLoad={() => setLoaded(true)}
                    className="w-full h-full object-contain" // Ensure the image fits within the container
                    style={{ maxWidth: "100%", minHeight:"100%", minWidth:"100%", maxHeight: "100%" }} // Ensure the image scales properly
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    width={navigation ? 1280 : 1920}
                    height={navigation ? 853 : 1280}
                    controls
                    autoPlay
                    onLoadedData={() => setLoaded(true)}
                    className="w-full h-full object-contain" // Ensure the video fits within the container
                    style={{ maxWidth: "100%", maxHeight: "100%" }} // Ensure the video scales properly
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
  
        {/* Buttons + Top Nav Bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {index > 0 && (
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, -50%, 0)" }}
                      onClick={() => changePhotoId(index - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {index + 1 < mediaUrls.length && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/20 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, -50%, 0)" }}
                      onClick={() => changePhotoId(index + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute top-0 right-0 flex items-center gap-2 p-3 text-white">
                {navigation ? (
                  <a
                    href={currentMedia.url}
                    className="rounded-full bg-black/20 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white"
                    target="_blank"
                    title="Open fullsize version"
                    rel="noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  </a>
                ) : (
                  <a
                    href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20media!%0A%0A${encodeURIComponent(
                      currentMedia.url
                    )}`}
                    className="rounded-full bg-black/20 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white"
                    target="_blank"
                    title="Share on Twitter"
                    rel="noreferrer"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                <button
                  onClick={() =>
                    downloadPhoto(currentMedia.url, `${currentMedia.id}.jpg`)
                  }
                  className="rounded-full bg-black/20 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-0 left-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={closeModal}
                  className="rounded-full bg-black/20 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/40 hover:text-white"
                >
                  {navigation ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
  
        {/* Bottom Nav Bar */}
        {navigation && (
          <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
            <motion.div
              initial={false}
              className="mx-auto mt-6 mb-6 flex aspect-[3/2] h-16 gap-1"
            >
              <AnimatePresence initial={false}>
                {filteredMedia.map((media) => (
                  <motion.button
                    key={media.id}
                    initial={{
                      width: "0%",
                      x: `${Math.max((index - 1) * -100, 15 * -100)}%`,
                    }}
                    animate={{
                      scale: media.id === index ? 1.3 : 1,
                      width: "100%",
                      x: `${Math.max(index * -100, 15 * -100)}%`,
                    }}
                    exit={{ width: "0%" }}
                    onClick={() => changePhotoId(media.id)}
                    className={`${
                      media.id === index
                        ? "z-20 rounded-md shadow-lg shadow-black/50"
                        : "z-10"
                    } ${media.id === 0 ? "rounded-l-md" : ""} ${
                      media.id === mediaUrls.length - 1 ? "rounded-r-md" : ""
                    } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none transition-all`}
                  >
                    {mediaType === "photo" ? (
                      <Image
                        alt="small media on the bottom"
                        width={180}
                        height={120}
                        className={`${
                          media.id === index
                            ? "brightness-110 hover:brightness-110"
                            : "brightness-50 contrast-125 hover:brightness-75"
                        } h-full w-full object-cover transition-all rounded-md`}
                        src={media.url}
                      />
                    ) : (
                      <VideoThumbnail
                        videoUrl={media.url}
                        thumbnailHandler={(thumbnail) => (
                          <Image
                            alt="video thumbnail"
                            width={220}
                            height={220}
                            className={`${
                              media.id === index
                                ? "brightness-110 hover:brightness-110"
                                : "brightness-50 contrast-125 hover:brightness-75"
                            } h-full w-full object-cover transition-all rounded-md`}
                            src={thumbnail}
                          />
                        )}
                        width={400}
                        height={300}
                      />
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}