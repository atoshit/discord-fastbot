export interface BlacklistEntry {
    userId: string;
    reason: string;
    authorId: string;
    date: number;
    rejoinAttempts: number;
} 