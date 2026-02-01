import { cleanDir } from './utils/clean-dir';
import { PHOTOS_SUBFOLDER } from './utils/storage-paths';

async function main() {
  console.log('🧹 Cleaning photo uploads...');
  await cleanDir(PHOTOS_SUBFOLDER);
  console.log('✅ Photo uploads cleaned');
}

main();
