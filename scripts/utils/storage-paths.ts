import 'dotenv/config';
import path from 'path';
import { appConfig } from '../../src/config/app-config';

const config = appConfig();

const PHOTO_STORAGE_PATH = config.storage.path;

export const PHOTOS_SUBFOLDER = path.join(
  PHOTO_STORAGE_PATH,
  config.storage.photosSubfolder,
);

export const THUMBNAILS_SUBFOLDER = path.join(
  PHOTO_STORAGE_PATH,
  config.storage.thumbnailsSubfolder,
);
