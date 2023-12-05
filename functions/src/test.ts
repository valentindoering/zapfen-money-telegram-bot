import TelegramBot from "node-telegram-bot-api"
import { TLogger } from "./logger"
import { TTelegramClient } from "./telegramClient"
import { TUser, TUsers, TZapfenStore } from "./zapfenStore"
import { dailyZapfenFees, zapfenMain } from "./zapfenMain"

class DummyZapfenStore implements TZapfenStore {
    private users = users

    constructor(logFunction: (txt: string) => Promise<void>) {
        
    }

    async getUsers(): Promise<TUsers> {
        console.log('DummyZapfenStore.getUsers:', this.users)
        return this.users
    }

    async setUser(userId: string, userValues: TUser) {
        this.users[userId] = userValues
        console.log('DummyZapfenStore.setUser:', userId, userValues)
    }

    async setUsers(users: TUsers) {
        this.users = users
        console.log('DummyZapfenStore.setUsers:', users)
    }
    
}

class DummyTelegramClient implements TTelegramClient {
    public async sendText(text: string): Promise<TelegramBot.Message> {
        console.log("DummyTelegramClient.sendText:", text)
        return {} as TelegramBot.Message
    }

    public async sendVoiceMessage(voicePath: string): Promise<TelegramBot.Message> {
        console.log(voicePath)
        return {} as TelegramBot.Message
    }

    public async sendImage(imagePath: string): Promise<TelegramBot.Message> {
        console.log(imagePath)
        return {} as TelegramBot.Message
    }
}

class DummyLogger implements TLogger {
    async optional(txt: string): Promise<void> {
        console.log("DummyLogger.optional:", txt)
    }

    async telegram(txt: string): Promise<void> {
        console.log("DummyLogger.telegram:", txt)
    }
}

function getIdFromName(name: string): number {
    const id = Object.keys(users).find(key => users[key].name === name)
    if (!id) {
        throw new Error('getIdFromName was undefined')
    }
    return parseInt(id)
}

async function testScenario(senderName: string, message: string, users: TUsers): Promise<TUsers> {
    console.log(`testScenario(${senderName}, ${message}, ${JSON.stringify(users)}) ------------------------------------------------------------------------------------------------------------------------------`)
    const request = {
        body: {
            message: {
                chat: {
                    id: -625745443 // config variable
                },
                from: {
                    id: getIdFromName(senderName)
                },
                text: message
            }
        }
    }
    const response = {
        send: (txt: string) => {
            console.log(txt)
        }
    }

    await zapfenMain(DummyTelegramClient, DummyLogger, DummyZapfenStore, request, response);

    console.log(`------------------------------------------------------------------------------------------------------------------------------testScenario done, users: ${JSON.stringify(users)}`) 
    return users
}

async function dailyFeeTestScenario(users: TUsers): Promise<TUsers> {
    console.log(`dailyFeeTestScenario(${JSON.stringify(users)}) ------------------------------------------------------------------------------------------------------------------------------`)
    const response = {
        send: (txt: string) => {
            console.log(txt)
        }
    }

    await dailyZapfenFees(DummyTelegramClient, DummyLogger, DummyZapfenStore, response);

    console.log(`------------------------------------------------------------------------------------------------------------------------------testScenario done, users: ${JSON.stringify(users)}`) 
    return users
}

// ----------------------------------------------------------------
// start data, referenced in DummyZapfenStore
const users: TUsers = {

    "4375933": {
        "zapfen": 25,
        "name": "Valentin",
        "sepa": true,
        "nDaysBelowMin": 4
    }, 
    "8856722": {
        "zapfen": 63,
        "name": "Sandra",
        "sepa": true,
        "nDaysBelowMin": 0
    }, 
    "2992922": {
        "zapfen": 2,
        "name": "Dennis",
        "sepa": true,
        "nDaysBelowMin": 7
    }
}

async function test() {
    // await testScenario("Valentin", "Sandra 1 Zapfen")
    // await testScenario("Sandra", "SEPA Zapfen off", users)
    // await testScenario("Dennis", "SEPA 10 Zapfen", users)
    await testScenario("Valentin", "SEPA 10 Zapfen", users)

    await dailyFeeTestScenario(users)

}

test();