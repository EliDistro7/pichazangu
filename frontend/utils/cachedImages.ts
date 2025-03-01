import { getEventMedia } from "actions/event";

// utils/getResults.ts
let cachedResults: { [key: string]: any } = {};

export default async function getResults(
  eventId: string,
  mediaType: 'photo' | 'video'
) {
  const cacheKey = `${eventId}_${mediaType}`;
  if (!cachedResults[cacheKey]) {
    // Replace this fetch URL with your API/database call.
    const eventData = await getEventMedia({eventId, mediaType})
   
    // Assume eventData contains both imageUrls and videoUrls
    cachedResults[cacheKey] =eventData;
    //  mediaType === 'video' ? eventData.videoUrls : eventData.imageUrls;
  }
  return cachedResults[cacheKey];
}
