// eslint-disable-next-line import/no-unresolved
import { translations } from '@params';

export const t = (key: string, scope: string): string => {
    const translation = translations[scope]?.[key];
    if (!translation) throw new Error(`Translation not found: ${scope}/${key}`);
    return typeof translation === 'string' ? translation : translation.other;
};
