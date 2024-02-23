// TODO: We can remove those after https://github.com/gohugoio/hugo/pull/12119 is released. Then, they should be picked
// up automatically from our TSConfig.
// @jsxImportSource preact
// @jsxRuntime automatic
// eslint-disable-next-line import/no-unresolved
import { baseUrl } from '@params';
import { Buffer } from 'buffer';
import type { Har } from 'har-format';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { processRequest, unhar, type AnnotatedResult, type Request } from 'trackhar';
import { getFragmentParams } from './util/browser';
import { t as _t } from './util/i18n';

const t = (key: string) => _t('trackhar-ui-' + key, 'hugo');
const absUrl = (path: string) => baseUrl + path;

const App = () => {
    const [hideUnmatched, setHideUnmatched] = useState<boolean>(true);
    const [error, setError] = useState<string>();
    const [requests, setRequests] = useState<{ request: Request; result: AnnotatedResult | undefined }[]>([]);

    useEffect(() => {
        const fragmentParams = getFragmentParams();
        const requestId = fragmentParams['request-id'];
        if (!requestId) return;

        (async () => {
            try {
                const requestData = await fetch(
                    `https://data.tweasel.org/data/requests/${requestId}.json?_shape=array&_json=headers&_json=cookies`
                ).then((r) => r.json());
                const request: Request | undefined = requestData[0];
                if (!request) throw new Error('No request.');

                const content = request.content as string | { $base64: true; encoded: string } | undefined;
                if (content && typeof content !== 'string' && content['$base64'] === true)
                    request.content = Buffer.from(content.encoded, 'base64').toString('binary');

                const trackHarResult = processRequest(request);
                setRequests([{ request, result: trackHarResult }]);
            } catch (err) {
                console.error('Failed to fetch or parse:', err);
                setError(t('parsing-failed-request'));
            }
        })();
    }, []);

    return (
        <>
            <label>
                {t('choose-har')}{' '}
                <input
                    type="file"
                    accept=".har,.json,application/json,application/har+json"
                    multiple={false}
                    onChange={async (e) => {
                        const file = e.currentTarget.files?.[0];
                        if (!file) return;

                        setError(undefined);

                        try {
                            const har: Har = JSON.parse(await file.text());
                            const requests = unhar(har);
                            const trackHarResult = requests.map((r) => processRequest(r));

                            setRequests(requests.map((request, i) => ({ request, result: trackHarResult[i] })));
                        } catch (error) {
                            console.error('Parsing failed:', error);
                            setError(t('parsing-failed-har'));
                        }
                    }}
                />
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={hideUnmatched}
                    onChange={(e) => setHideUnmatched(e.currentTarget.checked)}
                    style="margin-left: 10px;"
                />{' '}
                {t('hide-unmatched')}
            </label>

            <div>
                {error ? (
                    <em>{error}</em>
                ) : (
                    requests
                        .filter((r) => !hideUnmatched || r.result)
                        .map(({ request, result }) => {
                            const adapter = result?.[0]?.adapter;

                            return (
                                <>
                                    <h2>
                                        <code style="word-break: break-all;">
                                            <strong>{request.method}</strong> {request.scheme}://{request.host}
                                            {request.path}
                                        </code>
                                    </h2>

                                    {result ? (
                                        <>
                                            <em>
                                                {adapter === 'indicators' ? (
                                                    t('matched-by-indicators')
                                                ) : (
                                                    <>
                                                        {t('matched-by-adapter')}{' '}
                                                        <a href={absUrl('t/' + adapter)} target="_blank">
                                                            {adapter}
                                                        </a>
                                                    </>
                                                )}
                                            </em>

                                            <table class="data-table">
                                                <thead>
                                                    <tr>
                                                        <th style="width: 25%;">
                                                            {_t(
                                                                'tracker-single-transmitted-data-table-head-property',
                                                                'hugo'
                                                            )}
                                                        </th>
                                                        <th style="width: 10%;">
                                                            {_t(
                                                                'tracker-single-transmitted-data-table-head-context',
                                                                'hugo'
                                                            )}
                                                        </th>
                                                        <th style="width: 25%;">
                                                            {_t(
                                                                'tracker-single-transmitted-data-table-head-path',
                                                                'hugo'
                                                            )}
                                                        </th>
                                                        <th style="width: 40%;">{t('value')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.map((r) => (
                                                        <tr>
                                                            <td>{_t(r.property as string, 'properties')}</td>
                                                            <td>{r.context}</td>
                                                            <td>
                                                                <code>
                                                                    {r.path}{' '}
                                                                    {r.reasoning.startsWith('https://') ||
                                                                    r.reasoning.startsWith('http://') ? (
                                                                        <a
                                                                            href={r.reasoning}
                                                                            rel="nofollow"
                                                                            target="_blank">
                                                                            <img
                                                                                src="/svg/external.svg"
                                                                                class="inline-icon icon-external"
                                                                                alt={_t(
                                                                                    'tracker-single-transmitted-data-table-reasoning-external-link-desc',
                                                                                    'hugo'
                                                                                )}
                                                                                title={_t(
                                                                                    'tracker-single-transmitted-data-table-reasoning-external-link-desc',
                                                                                    'hugo'
                                                                                )}
                                                                            />
                                                                        </a>
                                                                    ) : r.reasoning.endsWith('.md') ? (
                                                                        <a
                                                                            href={absUrl(
                                                                                'research/' +
                                                                                    r.reasoning
                                                                                        .replace(/\/([^/]+)$/, '#$1')
                                                                                        .replace(/.md$/, '')
                                                                            )}
                                                                            target="_blank">
                                                                            <img
                                                                                src="/svg/information.svg"
                                                                                class="inline-icon icon-information"
                                                                                title={_t(
                                                                                    'tracker-single-transmitted-data-table-reasoning-link-desc',
                                                                                    'hugo'
                                                                                )}
                                                                                alt={_t(
                                                                                    'tracker-single-transmitted-data-table-reasoning-link-desc',
                                                                                    'hugo'
                                                                                )}
                                                                            />
                                                                        </a>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </code>
                                                            </td>
                                                            <td>
                                                                <code>{r.value}</code>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <em>{t('unsupported-endpoint')}</em>
                                    )}
                                </>
                            );
                        })
                )}
            </div>
        </>
    );
};

const container = document.getElementById('trackhar-app');
if (container) render(<App />, container);
