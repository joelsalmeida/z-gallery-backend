import { cleanDir } from './utils/clean-dir';
import { THUMBNAILS_SUBFOLDER } from './utils/storage-paths';

async function main() {
  console.log('🧹 Cleaning thumbnails...');
  await cleanDir(THUMBNAILS_SUBFOLDER);
  console.log('✅ Thumbnails cleaned');
}

main();
