export const THUMBNAIL_QUEUE = 'thumbnail' as const;

export const THUMBNAIL_JOBS = {
  GENERATE: 'generate-thumbnail',
} as const;

export type ThumbnailJobName =
  (typeof THUMBNAIL_JOBS)[keyof typeof THUMBNAIL_JOBS];
