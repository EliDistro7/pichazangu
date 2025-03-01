/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height?: number;       // updated to number for easier arithmetic in your components
  width?: number;        // updated to number as well
  url?: string;          // direct URL from your database
  format?: string;
  blurDataUrl?: string;
  type?: "photo" | "video";   // distinguishes between photos and videos
  thumbnailUrl?: string;     // optional thumbnail URL for bottom navigation (if different from url)
}


export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentMedia?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  mediaType : string,
  direction?: number;
  mediaUrls: string[];
}

export interface MediaProps {
  id: number;
  height?: number;       // updated to number for easier arithmetic in your components
  width?: number;        // updated to number as well
  url: string;          // direct URL from your database
  format?: string;
  blurDataUrl?: string;
  type?: "photo" | "video";   // distinguishes between photos and videos
  thumbnailUrl?: string;     // optional thumbnail URL for bottom navigation (if different from url)
}
