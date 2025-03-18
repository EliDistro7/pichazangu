import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import useKeypress from "react-use-keypress";
import SharedModal from "./SharedModal";

export default function Modal({
  mediaUrls,
  mediaType,
  eventId,
  onClose,
}: {
  mediaUrls: string[];
  eventId: string; // Event ID for navigation
  mediaType: "photo" | "video";
  onClose?: () => void;
}) {
  const overlayRef = useRef(null); // Ref for the modal overlay
  const router = useRouter();

  // Get the photoId from the URL query
  const { photoId } = router.query;
  const initialIndex = Number(photoId);

  // State for navigation direction and current index
  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(initialIndex);

  // Function to handle modal close
  function handleClose() {
    router.push(`/evento/${eventId}`); // Remove photoId from URL
    onClose?.(); // Call the onClose callback if provided
  }

  // Function to change the current media index
  function changePhotoId(newIndex: number) {
    if (newIndex > curIndex) {
      setDirection(1); // Swipe right
    } else {
      setDirection(-1); // Swipe left
    }
    setCurIndex(newIndex); // Update current index
    router.push(
      {
        query: { photoId: newIndex }, // Update URL with new photoId
      },
      `/p/${newIndex}`,
      { shallow: true },
    );
  }

  // Keyboard navigation
  useKeypress("ArrowRight", () => {
    if (curIndex + 1 < mediaUrls.length) {
      changePhotoId(curIndex + 1); // Navigate to the next media
    }
  });

  useKeypress("ArrowLeft", () => {
    if (curIndex > 0) {
      changePhotoId(curIndex - 1); // Navigate to the previous media
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center px-0"
    >
      {/* Backdrop with animation */}
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* SharedModal for media display and navigation */}
      <SharedModal
        index={curIndex}
        mediaUrls={mediaUrls.map((url, id) => ({ id, url }))} // Convert mediaUrls to an array of objects with id and url
        mediaType={mediaType}
        direction={direction}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
        currentMedia={{ id: curIndex, url: mediaUrls[curIndex] }} // Pass the current media object
      />
    </Dialog>
  );
}