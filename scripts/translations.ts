import { copyFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';

(async () => {
    const trackharTranslationsDir = join('node_modules', 'trackhar', 'i18n');
    const hugoDir = join('data', 'trackharTranslations');

    await mkdir(hugoDir, { recursive: true });

    const translationFiles = (await readdir(trackharTranslationsDir, { withFileTypes: true }))
        .filter((e) => e.isFile() && e.name.endsWith('.json'))
        .map((e) => e.name);

    for (const translationFile of translationFiles)
        await copyFile(join(trackharTranslationsDir, translationFile), join(hugoDir, translationFile));
})();
