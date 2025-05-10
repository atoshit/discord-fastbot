/**
 * Formate une durée en millisecondes en une chaîne lisible
 * @param ms Durée en millisecondes
 * @returns Chaîne formatée (ex: "2h 30m")
 */
export function formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const parts = [];

    if (days > 0) parts.push(`${days}j`);
    if (hours % 24 > 0) parts.push(`${hours % 24}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    if (seconds % 60 > 0 && parts.length === 0) parts.push(`${seconds % 60}s`);

    return parts.join(' ') || '0s';
}

/**
 * Formate un nombre avec des séparateurs de milliers
 * @param num Nombre à formater
 * @returns Chaîne formatée (ex: "1,234,567")
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
}

/**
 * Formate une date en timestamp Discord
 * @param date Date à formater
 * @param format Format de timestamp Discord (R = relatif, F = complet, etc.)
 * @returns Chaîne formatée pour Discord
 */
export function formatTimestamp(date: Date, format: 'R' | 'F' | 't' | 'T' | 'd' | 'D' = 'R'): string {
    return `<t:${Math.floor(date.getTime() / 1000)}:${format}>`;
} 