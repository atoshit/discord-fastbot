import { CommandInteraction, SlashCommandBuilder, ChatInputApplicationCommandData, GuildMember } from 'discord.js';
import { CommandOptions } from '../interfaces/Command';
import { CustomClient } from './CustomClient';
import { isOwner } from '../config/owners';

export abstract class BaseCommand {
    public client: CustomClient;
    public options!: CommandOptions;
    public data!: ChatInputApplicationCommandData;

    constructor(client: CustomClient) {
        this.client = client;
    }

    abstract execute(interaction: CommandInteraction): Promise<void>;

    protected t(key: string, ...args: any[]) {
        return this.client.locale.t(key, undefined, ...args);
    }

    protected hasPermission(interaction: CommandInteraction): boolean {
        if (isOwner(interaction.user.id)) {
            return true;
        }

        if (this.options.ownerOnly && !isOwner(interaction.user.id)) {
            return false;
        }

        const member = interaction.member as GuildMember;
        if (!member) return false;

        for (const roleId of member.roles.cache.keys()) {
            if (this.client.cache.isCommandAllowedForRole(roleId, interaction.guildId!, this.options.name)) {
                return true;
            }
        }

        return false;
    }
}