import admin from 'firebase-admin';
admin.initializeApp();


export interface TUser {
    name: string;
    zapfen: number;
    sepa: boolean;
    nDaysBelowMin: number;
  }
  
export type TUsers = {
    [key: string]: TUser;
};

/*
const users: TUsers = {
    613842264: {"name": "Valentin", "zapfen": 100},
    613842212: {"name": "Karla", "zapfen": 105},
};
*/

export interface TZapfenStoreConstructor {
    new (logFunction: (txt: string) => Promise<void>): TZapfenStore
}

export interface TZapfenStore {
    getUsers(): Promise<TUsers>;
    setUser(userId: string, userValues: TUser): Promise<void>;
    setUsers(users: TUsers): Promise<void>;
}


export class ZapfenStore implements TZapfenStore{
    private zapfenRef: any;
    private db: any;
    private logFunction: (txt: string) => Promise<void>;

    constructor(logFunction: (txt: string) => Promise<void>) {
        this.db = admin.firestore()
        this.zapfenRef = this.db.collection('zapfen-store')
        this.logFunction = logFunction
    }

    private async errorHandling(operationName: string, firestoreOperation: () => Promise<any>) {
        try {
            const result = await firestoreOperation()
            this.logFunction(`Firestore operation ${operationName} successful`)
            return result
        } catch (error) {
            const logMessage = `Error in Firestore operation ${operationName}: ${error}`;
            this.logFunction(logMessage);
            throw new Error(logMessage)
        }
    }


    async getUsers(): Promise<TUsers> {
        return await this.errorHandling('getUsers', async () => {
            let users: any = {}
            const snapshot = await this.zapfenRef.get();
            
            snapshot.forEach((doc: any) => {
                let id = doc.id;
                let data = doc.data();
                users[id] = data
            });
            return users;
        })
      }


    async setUser(userId: string, userValues: TUser) {
        return await this.errorHandling('setUser', async () => {
            const docRef = this.zapfenRef.doc(userId);
            return await docRef.update(userValues);
        })
    }

    async setUsers(users: TUsers) {
        return await this.errorHandling('setUsers', async () => {
            const batch = this.db.batch();

            for (const id in users) {
              const docRef = this.zapfenRef.doc(id);
              batch.set(docRef, users[id], { merge: true });
            }

            return await batch.commit();
        })
    }
}

