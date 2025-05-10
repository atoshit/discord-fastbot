export interface WhitelistedRole {
    roleId: string;
    guildId: string;
    allowedCommands: string[];
    addedBy: string;
    addedAt: number;
} 