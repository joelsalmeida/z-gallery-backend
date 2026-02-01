import { cleanDir } from './utils/clean-dir';
import { PHOTOS_SUBFOLDER, THUMBNAILS_SUBFOLDER } from './utils/storage-paths';

async function main() {
  console.log('🧹 Cleaning all local storage...');
  await cleanDir(PHOTOS_SUBFOLDER);
  await cleanDir(THUMBNAILS_SUBFOLDER);
  console.log('✅ Local storage cleaned');
}

main();
