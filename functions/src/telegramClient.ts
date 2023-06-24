import TelegramBot from 'node-telegram-bot-api'

export interface TTelegramClientConstructor {
    new (telegramChatId: string, telegramBotKey: string): TTelegramClient
}

export interface TTelegramClient {
    sendText(text: string): Promise<TelegramBot.Message>;
    sendVoiceMessage(voicePath: string): Promise<TelegramBot.Message>;
    sendImage(imagePath: string): Promise<TelegramBot.Message>;
}

export class TelegramClient implements TTelegramClient {
    private bot: TelegramBot;
    private telegramChatId: string;

    constructor(telegramChatId: string, telegramBotKey: string) {
        this.telegramChatId = telegramChatId;

        this.bot = new TelegramBot(telegramBotKey, { polling: false });
    }

    public async sendText(text: string): Promise<TelegramBot.Message> {
        return await this.bot.sendMessage(this.telegramChatId, text)
    }

    public async sendVoiceMessage(voicePath: string): Promise<TelegramBot.Message> {
        return await this.bot.sendVoice(this.telegramChatId, voicePath)
    }

    public async sendImage(imagePath: string): Promise<TelegramBot.Message> {
        return await this.bot.sendPhoto(this.telegramChatId, imagePath)
    }

}
