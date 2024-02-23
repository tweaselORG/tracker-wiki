declare module '@params' {
    export const language: string;
    export const translations: Record<string, Record<string, string | { other: string; one?: string }>>;

    export const baseUrl: string;
}
