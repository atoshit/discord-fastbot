export class LocaleManager {
    private defaultLocale: string;
    private translations: Map<string, Record<string, string>>;

    constructor() {
        this.defaultLocale = 'fr';
        this.translations = new Map();
    }

    setLocale(locale: string) {
        this.defaultLocale = locale;
    }

    translate(key: string, locale?: string) {
        const currentLocale = locale || this.defaultLocale;
        const translation = this.translations.get(currentLocale);
        return translation?.[key] || key;
    }
} 