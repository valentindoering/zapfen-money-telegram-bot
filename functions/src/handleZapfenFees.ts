import { TUsers, TZapfenStore } from "./zapfenStore";
import { TLogger } from "./logger";
import { TTransaction, Transactor } from "./transactor";


export async function handleZapfenFees(logger: TLogger, zapfenStore: TZapfenStore) {
    let USERS: TUsers = await zapfenStore.getUsers()

    // should get config or database var!
    const zapfenMin = 50
    const zapfenFeePerDayPerMate = 2
    const nDaysAllowedUnderMin = 3

    let transactions: TTransaction[] = []
    const userKeys = Object.keys(USERS)
    for (let userKey of userKeys) {

        // 1. create zapfen fee transactions
        if (USERS[userKey].nDaysBelowMin > nDaysAllowedUnderMin && USERS[userKey].zapfen < zapfenMin) {

            logger.telegram(`${USERS[userKey].name}: Zapfen below ${zapfenMin} for more than ${nDaysAllowedUnderMin} days. Zapfen fee of ${zapfenFeePerDayPerMate} Zapfen per roomate applied.`)
            const otherSepaUserIds = Object.keys(USERS).filter(id => id !== userKey);
            for (const otherSepaUserId of otherSepaUserIds) {
                transactions.push({
                    senderId: userKey,
                    recipientId: otherSepaUserId,
                    amount: zapfenFeePerDayPerMate
                  })
            }

            USERS[userKey].nDaysBelowMin = -1
        }

        // 2. update nDaysBelowMin
        if (USERS[userKey].zapfen < zapfenMin) {
            USERS[userKey].nDaysBelowMin += 1
        } else {
            USERS[userKey].nDaysBelowMin = 0
        }
    }

    zapfenStore.setUsers(USERS)

    if (transactions.length > 0) {
        const transactor = new Transactor(zapfenStore, USERS)
        await transactor.apply(transactions)
        const transactionMessage = await transactor.message(transactions)
        return await logger.telegram(transactionMessage)
    }

}
