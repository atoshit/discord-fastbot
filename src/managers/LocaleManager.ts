import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export class LocaleManager {
    private defaultLocale: string;
    private translations: Map<string, any>;

    constructor() {
        this.defaultLocale = 'fr';
        this.translations = new Map();
        this.loadTranslations();
    }

    private loadTranslations() {
        const localesPath = join(__dirname, '..', 'locales');
        const localeFiles = readdirSync(localesPath).filter(file => file.endsWith('.json'));

        for (const file of localeFiles) {
            const locale = file.replace('.json', '');
            const filePath = join(localesPath, file);
            const translations = JSON.parse(readFileSync(filePath, 'utf-8'));
            this.translations.set(locale, translations);
        }
    }

    setLocale(locale: string) {
        if (this.translations.has(locale)) {
            this.defaultLocale = locale;
        }
    }

    t(key: string, locale?: string, ...args: any[]): string {
        const currentLocale = locale || this.defaultLocale;
        const translation = this.translations.get(currentLocale);
        
        if (!translation) return key;

        const keys = key.split('.');
        let value = translation;

        for (const k of keys) {
            value = value?.[k];
            if (!value) return key;
        }

        if (typeof value !== 'string') return key;

        if (args.length > 0) {
            return value.replace(/%[sdx]/g, () => String(args.shift()));
        }

        return value;
    }
} 