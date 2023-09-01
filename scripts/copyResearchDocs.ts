import { execa } from 'execa';
import { copyFile, cp, mkdir, rm, writeFile } from 'fs/promises';
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

    console.info(`Fetching data for TrackHAR version: ${trackharVersion}`);
    await execa('git', [
        'clone',
        '--depth=1',
        '--branch',
        `v${trackharVersion}`,
        'https://github.com/tweaselORG/TrackHAR',
        'trackhar_tmp',
    ]);

    // Create the research directory to not break older builds
    await mkdir('trackhar_tmp/research-docs', { recursive: true });
    // Preserve the _index.md file, which contains the information of the section.
    await copyFile('content/en/research/_index.md', 'trackhar_tmp/research-docs/_index.md');
    await rm('trackhar_tmp/research-docs/README.md', { force: true });
    console.info('Removing old research docs…');
    await rm('content/en/research', { recursive: true, force: true });
    console.info('Copying fresh content…');
    await cp('trackhar_tmp/research-docs', 'content/en/research', { recursive: true });

    await rm('trackhar_tmp', { recursive: true, force: true });

    await writeFile('data/trackharVersion.json', JSON.stringify({ trackharReleaseTag: `v${trackharVersion}` }));
})();

/* eslint-enable no-console */
