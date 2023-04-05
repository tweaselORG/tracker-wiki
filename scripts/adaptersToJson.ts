import { getDirname } from 'cross-dirname';
import { mkdir, rm, writeFile } from 'fs/promises';
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

    await rm(join(getDirname(), '../content/tracker'), { recursive: true, force: true });
    await Promise.all(
        Object.values(trackers).map(async (tracker) => {
            // { recursive: true } behaves like mkdir -p
            await mkdir(join(getDirname(), '../content/tracker', tracker.slug), { recursive: true });
            await writeFile(
                join(getDirname(), '../content/tracker', tracker.slug, '_index.md'),
                JSON.stringify(tracker) + '\n&nbsp;',
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
                        join(getDirname(), '../content/tracker', adapter.tracker.slug, `${adapter.slug}.json.md`),
                        JSON.stringify(adapter, (_, value) => (value instanceof RegExp ? value.toString() : value)) +
                            '\n&nbsp;',
                        'utf8'
                    )
                )
        )
    );
})();
