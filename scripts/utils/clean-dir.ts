import fs from 'fs/promises';
import path from 'path';

export async function cleanDir(dir: string, keep: string[] = ['.gitkeep']) {
  const keepSet = new Set(keep);

  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries
      .filter((e) => !keepSet.has(e.name))
      .map((e) =>
        fs.rm(path.join(dir, e.name), { recursive: true, force: true }),
      ),
  );
}
