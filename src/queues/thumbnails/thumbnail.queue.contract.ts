export const THUMBNAIL_QUEUE = 'thumbnail' as const;

export const THUMBNAIL_JOBS = {
  GENERATE: 'generate-thumbnail',
} as const;

export type ThumbnailJobName =
  (typeof THUMBNAIL_JOBS)[keyof typeof THUMBNAIL_JOBS];

// ==============================
// Realtime (Pub/Sub channels)
// ==============================

export const THUMBNAIL_CHANNELS = {
  READY: 'thumbnail-ready',
} as const;

export type ThumbnailChannel =
  (typeof THUMBNAIL_CHANNELS)[keyof typeof THUMBNAIL_CHANNELS];
