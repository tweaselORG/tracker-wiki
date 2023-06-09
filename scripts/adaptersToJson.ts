import { getDirname } from 'cross-dirname';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import type { Tracker } from 'trackhar';
import { adapters } from 'trackhar';

(async () => {
    const trackers = adapters.reduce<Record<string, Tracker & { adapters: string[]; title: Tracker['name'] }>>(
        (trackers, adapter) => {
            if (!trackers[adapter.tracker.slug])
                trackers[adapter.tracker.slug] = {
                    ...adapter.tracker,
                    adapters: [adapter.slug],
                    title: adapter.tracker.name,
                };
            else trackers[adapter.tracker.slug]!.adapters.push(adapter.slug);
            return trackers;
        },
        {}
    );

    const languages = await readFile(join(getDirname(), '../config/_default/languages.json')).then((file) =>
        Object.keys(JSON.parse(file.toString()))
    );

    for (const language of languages) {
        const trackerContentDir = join(getDirname(), '../content', language, 't');
        await rm(trackerContentDir, { recursive: true, force: true });
        await Promise.all(
            Object.values(trackers).map(async (tracker) => {
                // { recursive: true } behaves like mkdir -p
                await mkdir(join(trackerContentDir, tracker.slug), { recursive: true });
                await writeFile(
                    join(trackerContentDir, tracker.slug, '_index.md'),
                    JSON.stringify(tracker, null, 4) + '\n&nbsp;',
                    'utf8'
                );
            })
        ).then(() =>
            Promise.all(
                adapters
                    .map((adapter) => {
                        delete adapter['match'];

                        return {
                            ...adapter,
                            title: adapter.slug,
                        };
                    })
                    .map((adapter) =>
                        writeFile(
                            join(trackerContentDir, adapter.tracker.slug, `${adapter.slug}.json.md`),
                            JSON.stringify(
                                adapter,
                                (_, value) => (value instanceof RegExp ? value.toString() : value),
                                4
                            ) + '\n&nbsp;',
                            'utf8'
                        )
                    )
            )
        );
    }
})();
