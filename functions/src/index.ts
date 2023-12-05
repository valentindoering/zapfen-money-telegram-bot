import * as functions from "firebase-functions";
import { TelegramClient } from "./telegramClient";
import { Logger } from "./logger";
import { ZapfenStore } from "./zapfenStore";
import { TRequest, TResponse, dailyZapfenFees, zapfenMain } from "./zapfenMain";

// Zapfen project
export const helloWorld = functions.https.onRequest(async (request: TRequest, response: TResponse) => {
  return await zapfenMain(TelegramClient, Logger, ZapfenStore, request, response);
})

// Zapfen project
export const daily = functions.https.onRequest(async (request: TRequest, response: TResponse) => {
  return await dailyZapfenFees(TelegramClient, Logger, ZapfenStore, response);
})

