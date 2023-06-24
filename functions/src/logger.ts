import { TTelegramClient } from "./telegramClient"

export interface TLoggerConstructor {
    new (telegramClient: TTelegramClient, telegramLoggingClient?: TTelegramClient): TLogger
}

export interface TLogger {
    optional(txt: string): Promise<void>
    telegram(txt: string): Promise<void>
}

export class Logger implements TLogger {
    private telegramClient: TTelegramClient
    private telegramLoggingClient: TTelegramClient | undefined


    constructor(telegramClient: TTelegramClient, telegramLoggingClient?: TTelegramClient) {
        this.telegramClient = telegramClient
        this.telegramLoggingClient = telegramLoggingClient
    }

    async optional(txt: string): Promise<void> {
        console.log(txt)
        await this.telegramLoggingClient?.sendText(txt)
    }

    async telegram(txt: string): Promise<void> {
        await this.telegramClient.sendText(txt);
        await this.optional(txt)
    }
}
