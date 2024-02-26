export const getFragmentParams = () => {
    // Inspired by: https://gist.github.com/miohtama/1570295
    const hashes = window.location.href.includes('#!')
        ? window.location.href.slice(window.location.href.indexOf('#!') + 2).split('&')
        : [];
    return hashes.reduce<Record<string, string>>((acc, cur) => {
        const [key, value] = cur.split('=');
        if (!key) return acc;

        return { ...acc, [key]: value ? decodeURIComponent(value) : '' };
    }, {});
};
