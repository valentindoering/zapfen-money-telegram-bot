import dotenv from 'dotenv';

dotenv.config();

export interface DbConfig {
    ZAPFEN_TELEGRAM_BOT_KEY: string
    ZAPFEN_TELEGRAM_CHAT_ID: string
    LOG_TELEGRAM_BOTKEY: string
    LOG_TELEGRAM_CHATID: string
}

export const dbConfig: DbConfig = {
    ZAPFEN_TELEGRAM_BOT_KEY: process.env.ZAPFEN_TELEGRAM_BOT_KEY || '',
    ZAPFEN_TELEGRAM_CHAT_ID: process.env.ZAPFEN_TELEGRAM_CHAT_ID || '',
    LOG_TELEGRAM_BOTKEY: process.env.LOG_TELEGRAM_BOTKEY || '',
    LOG_TELEGRAM_CHATID: process.env.LOG_TELEGRAM_CHATID || '',
}