import * as functions from "firebase-functions";
import { TelegramClient } from "./telegramClient";
import { Logger } from "./logger";
import { ZapfenStore } from "./zapfenStore";
import { TRequest, TResponse, zapfenMain } from "./zapfenMain";
import { dbConfig } from "./config";

// other project
export const testEndpoint = functions.https.onRequest(async (request, response) => {
  const BOTKEY = dbConfig.LOG_TELEGRAM_BOTKEY
  const CHATID = dbConfig.LOG_TELEGRAM_CHATID
  const telegram = new TelegramClient(CHATID, BOTKEY)
  telegram.sendText(JSON.stringify(request.body))
  response.send("ok!")
});

// Zapfen project
export const helloWorld = functions.https.onRequest(async (request: TRequest, response: TResponse) => {
  return await zapfenMain(TelegramClient, Logger, ZapfenStore, request, response);
})

