import { TTelegramClientConstructor } from "./telegramClient";
import { TZapfenStoreConstructor } from "./zapfenStore";
import { TLoggerConstructor } from "./logger";
import { handleZapfenMessage } from "./handleZapfenMessage";
import { dbConfig } from "./config";

export interface TRequest {
  body: {
    message: {
      chat: {
        id: number
      }
      text: string
      from: {
        id: number
      }
    }
  }
}

export interface TResponse {
  send: (txt: string) => void
}



export async function zapfenMain(
  telegramClientCls: TTelegramClientConstructor, 
  loggerCls: TLoggerConstructor, 
  zapfenStoreCls: TZapfenStoreConstructor, 
  request: TRequest, 
  response: TResponse
  ) {
    const ZAPFEN_TELEGRAM_BOT_KEY = dbConfig.ZAPFEN_TELEGRAM_BOT_KEY
    const ZAPFEN_TELEGRAM_CHAT_ID = dbConfig.ZAPFEN_TELEGRAM_CHAT_ID
    const telegram = new telegramClientCls(ZAPFEN_TELEGRAM_CHAT_ID, ZAPFEN_TELEGRAM_BOT_KEY)
  
    // const BOTKEY = dbConfig.LOG_TELEGRAM_BOTKEY
    // const CHATID = dbConfig.LOG_TELEGRAM_CHATID
    // const telegramLoggingClient = new telegramClientCls(CHATID, BOTKEY)
  
    const logger = new loggerCls(telegram) //, telegramLoggingClient)
  
    try {
      const zapfenStore = new zapfenStoreCls(async (txt: string) => await logger.optional(txt))
      await handleZapfenMessage(request, logger, zapfenStore, ZAPFEN_TELEGRAM_CHAT_ID);
    } catch (error) {
      await logger.telegram(`Error: ${error}`)
    }
    response.send('ok')
  }
  
  