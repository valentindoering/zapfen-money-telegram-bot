import { TUsers, TZapfenStore } from './zapfenStore';

export interface TTransaction {
    recipientId: string;
    senderId: string;
    amount: number;
}

export class Transactor {
    private zapfenStore: TZapfenStore
    private USERS: TUsers

    constructor(zapfenStore: TZapfenStore, USERS: TUsers) {
        this.zapfenStore = zapfenStore
        this.USERS = USERS
    }

    async apply(transactions: TTransaction[]) {
        for (const transaction of transactions) {
            this.USERS[transaction.senderId].zapfen -= transaction.amount
            this.USERS[transaction.recipientId].zapfen += transaction.amount
        }
        await this.zapfenStore.setUsers(this.USERS)
    }

    async message(transactions: TTransaction[]) {
        if (transactions.length === 0) {
            throw new Error('No transactions')
        }

        // Header
        let messageText = `🌟 Transaction${transactions.length === 1 ? '' : 's'} successful\n`
        
        // Transactions
        for (const transaction of transactions) {
            messageText += `${transaction.amount} Zapfen: ${this.USERS[transaction.senderId].name} ➡️ ${this.USERS[transaction.recipientId].name}\n`
        }

        // Balance
        for (const [_, value] of Object.entries(this.USERS)) {
          messageText += `🌲 ${value.name}: ${value.zapfen} Zapfen\n`
        }
    
        return messageText
        
    }
}