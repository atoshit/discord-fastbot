import 'dotenv/config';
import { CustomClient } from './structures/CustomClient';
import { IntentsBitField } from 'discord.js';

const client = new CustomClient({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMembers
    ]
});

client.start(); 