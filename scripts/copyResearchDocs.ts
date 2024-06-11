import { execa } from 'execa';
import { copyFile, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { adapters, type Tracker } from 'trackhar';

type TrackharVersionFile = { trackharReleaseTag: string };
const trackharVersionFile = 'data/trackharVersion.json';

/**
 * Copies the research documentation from TrackHAR. Since we do not translate the research docs (yet), we only copy them
 * into the English section.
 */
/* eslint-disable no-console */
(async () => {
    // Get the current in-use version of TrackHAR
    const trackharVersion = await execa('yarn', [
        'list',
        '--pattern',
        'trackhar',
        '--depth=0',
        '--non-interactive',
        '--no-progress',
        '--json',
    ]).then(({ stdout }) => JSON.parse(stdout).data.trees[0].name.split('@')[1] as string);

    if (!process.env['FORCE_REGENERATE'] && (await stat(trackharVersionFile))) {
        const currentVersion = await readFile(trackharVersionFile).then(
            (res) => JSON.parse(res.toString()) as TrackharVersionFile
        );
        if (currentVersion.trackharReleaseTag === `v${trackharVersion}`) {
            // If we already copied the docs for the current version of TrackHAR, we don’t need to run this again.
            console.info('Version was generated already, skipping…');
            return;
        }
    }

    // Remove any old data before cloning again.
    await rm('trackhar_tmp', { recursive: true, force: true });

    console.info(`Fetching data for TrackHAR version: ${trackharVersion}`);
    await execa('git', [
        'clone',
        '--depth=1',
        '--branch',
        `v${trackharVersion}`,
        'https://github.com/tweaselORG/TrackHAR',
        'trackhar_tmp',
    ]);

    const trackerNames = adapters.reduce<Record<string, Tracker['name']>>((trackers, adapter) => {
        if (!trackers[adapter.tracker.slug])
            trackers[adapter.tracker.slug] = adapter.tracker.name || adapter.tracker.slug;
        return trackers;
    }, {});

    // Create the research directory to not break older builds
    await mkdir('trackhar_tmp/research-docs', { recursive: true });
    // Preserve the _index.md file, which contains the information of the section.
    await copyFile('content/en/research/_index.md', 'trackhar_tmp/research-docs/_index.md');

    await rm('trackhar_tmp/research-docs/README.md', { force: true });
    console.info('Removing old research docs…');
    await rm('content/en/research', { recursive: true, force: true });
    console.info('Copying fresh content…');
    // Add index.md files if there are none because hugo wants those to create the pages.
    await Promise.all(
        (await readdir('trackhar_tmp/research-docs', { withFileTypes: true }))
            .filter((dirent) => dirent.isDirectory())
            .map((dir) =>
                writeFile(
                    join('trackhar_tmp/research-docs', dir.name, 'index.md'),
                    `{\n"title":"${trackerNames[dir.name]}"\n}\n&nbsp;`,
                    { flag: 'wx' }
                )
            )
    );
    await cp('trackhar_tmp/research-docs', 'content/en/research', { recursive: true });

    console.info('Generate new example data…');
    await execa('yarn', [], { cwd: 'trackhar_tmp' });
    // If the server is too slow, we should timeout after 10 minutes
    await execa('yarn', ['tsx', 'scripts/generate-example-data.ts'], { cwd: 'trackhar_tmp', timeout: 600000 });
    await copyFile('trackhar_tmp/research-docs/adapter-examples.json', 'data/adapterExamples.json');

    console.info('Cleanup…');
    await rm('trackhar_tmp', { recursive: true, force: true });

    await writeFile(trackharVersionFile, JSON.stringify({ trackharReleaseTag: `v${trackharVersion}` }));
})();

/* eslint-enable no-console */
