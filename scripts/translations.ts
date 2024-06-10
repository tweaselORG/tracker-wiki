import { mkdir, readFile, readdir, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Convert a string in the simple markup language used by TrackHAR to Markdown. See [TrackHAR's
 * README](https://github.com/tweaselORG/TrackHAR/blob/main/README.md#tracker-and-adapter-descriptions) for a
 * description of the format.
 *
 * Lists are already compatible with Markdown, so all we need to handle is references. We convert those to a custom
 * short code.
 */
const toMarkdown = (str: string) => str.replace(/\s*\[(https?:\/\/.+?)\]/g, '&nbsp;{{< reference url="$1" >}}');

(async () => {
    const trackharTranslationsDir = join('node_modules', 'trackhar', 'i18n');
    const hugoDir = join('data', 'trackharTranslations');

    await mkdir(hugoDir, { recursive: true });

    const translationFiles = (await readdir(trackharTranslationsDir, { withFileTypes: true }))
        .filter((e) => e.isFile() && e.name.endsWith('.json'))
        .map((e) => e.name);

    for (const translationFile of translationFiles) {
        const translations: Record<string, Record<string, string>> = JSON.parse(
            await readFile(join(trackharTranslationsDir, translationFile), 'utf8')
        );

        if (translations['tracker-descriptions']) {
            for (const [key, translation] of Object.entries(translations['tracker-descriptions']))
                translations['tracker-descriptions'][key] = toMarkdown(translation);
        }

        await writeFile(join(hugoDir, translationFile), JSON.stringify(translations, null, 4), 'utf8');
    }
})();
