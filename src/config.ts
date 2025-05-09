interface BotConfig {
    token: string;
    clientId: string;
    defaultPrefix: string;
    ownersId: string[];
    supportServer: string;
    defaultLanguage: string;
    embedColor: number;
    logs: {
        enabled: boolean;
        channelId: string;
    };
}

export const config: BotConfig = {
    token: process.env.TOKEN || '',
    clientId: process.env.CLIENT_ID || '',
    defaultPrefix: '/',
    ownersId: ['1369217636851777568'],
    supportServer: 'https://discord.gg/WEeggj3qGX',
    defaultLanguage: 'fr',
    embedColor: 0x7289DA,
    logs: {
        enabled: true,
        channelId: 'LOGS_CHANNEL_ID'
    }
}; 