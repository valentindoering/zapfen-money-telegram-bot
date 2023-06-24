import { TZapfenStore } from "./zapfenStore";
import { TLogger } from "./logger";
import { TTransaction, Transactor } from "./transactor";
import { TRequest } from "./zapfenMain";



export async function handleZapfenMessage(request: TRequest, logger: TLogger, zapfenStore: TZapfenStore, zapfenChatId: string) {

  await logger.optional(JSON.stringify(request.body));
  const MESSAGE = request.body.message;

  if (MESSAGE.chat.id !== Number(zapfenChatId)) {
    return await logger.optional(`No matching chat id: ${MESSAGE.chat.id} !== ${Number(zapfenChatId)}`);
  }

  if (!MESSAGE.text) {
    return await logger.optional(`Message does not contain text: ${JSON.stringify(MESSAGE)}`);
  }

  const TEXT_PARTS = MESSAGE.text.toLowerCase().split(' ');

  if (TEXT_PARTS.length !== 3) {
    return await logger.optional(`Incorrect number of words in message text: ${MESSAGE.text}`);
  }

  // Identify sender, get data
  const USERS = await zapfenStore.getUsers()
  const transactor = new Transactor(zapfenStore, USERS)
  /*
    USERS = {
      "4375933": {"zapfen": 25, "name": "Valentin","sepa": true}, 
      "8856722": {"zapfen": 63, "name": "Sandra", "sepa": true}, 
      "2992922": {"zapfen": 2, "name": "Dennis", "sepa": false}
    }
  */
  const SENDER_ID: string = MESSAGE.from.id.toString()
  if (!(SENDER_ID in USERS)) {
    return await logger.telegram(`Couldnt find sender with id ${SENDER_ID} in users ${JSON.stringify(USERS)}`)
  }

  /*
  Features:
  1. "SEPA Zapfen off" | "SEPA Zapfen on"
  2. "SEPA [Number] Zapfen"
  3. "[Name] [Number] Zapfen"
  */

  // 1. SEPA Zapfen off | SEPA Zapfen on
  if (TEXT_PARTS[0] === 'sepa' && TEXT_PARTS[1] === 'zapfen' && (TEXT_PARTS[2] == 'off' || TEXT_PARTS[2] == 'on')) {
    USERS[SENDER_ID].sepa = TEXT_PARTS[2] === 'on' ? true : false;
    await zapfenStore.setUser(SENDER_ID, USERS[SENDER_ID])
    return await logger.telegram(`SEPA ${TEXT_PARTS[2] === 'on' ? 'enabled' : 'disabled'} for ${USERS[SENDER_ID].name}`)
  }

  // 2. SEPA 10 Zapfen
  if (TEXT_PARTS[0] === 'sepa' && !isNaN(parseInt(TEXT_PARTS[1])) && TEXT_PARTS[2] === 'zapfen') {
    // amount
    const amount = parseInt(TEXT_PARTS[1]);
    if (amount <= 0 || amount >= 100) {
      return await logger.telegram(`SEPA amount ${amount} is not between 0 and 100`)
    }

    // transactions
    const otherSepaUserIds = Object.keys(USERS).filter(id => id !== SENDER_ID && USERS[id].sepa);
    if (otherSepaUserIds.length === 0) {
      return await logger.telegram(`All other users deactivated SEPA`)
    }
    const transactions: TTransaction[] = [];
    for (const otherSepaUserId of otherSepaUserIds) {
      transactions.push({
        senderId: otherSepaUserId,
        recipientId: SENDER_ID,
        amount: amount
      })
    }
    await transactor.apply(transactions)
    const transactionMessage = await transactor.message(transactions)
    return await logger.telegram(transactionMessage)

  }

  // 3. Dennis 10 Zapfen
  if (!isNaN(parseInt(TEXT_PARTS[1])) && TEXT_PARTS[2] === 'zapfen') {
    // recipient
    let recipientId;
    for (const [key, value] of Object.entries(USERS)) {
      if (value.name.toLowerCase() === TEXT_PARTS[0]) {
        recipientId = key
      }
    }
    if (!recipientId) {
      return await logger.telegram(`Couldnt identify a recipient from name '${TEXT_PARTS[0]}' in ${JSON.stringify(USERS)}`)
    }

    // amount
    const amount = parseInt(TEXT_PARTS[1]);
    if (USERS[SENDER_ID].zapfen < amount) {
      return await logger.telegram(`Not enough funds for the transaction: ${USERS[SENDER_ID].zapfen} < ${amount}`)
    }
    if (amount <= 0 || amount >= 100) {
      return await logger.telegram(`Amount ${amount} is not between 0 and 100`)
    }

    // transactions
    const transactions: TTransaction[] = [{
      senderId: SENDER_ID,
      recipientId: recipientId,
      amount: amount
    }]
    await transactor.apply(transactions)
    const transactionMessage = await transactor.message(transactions)
    return await logger.telegram(transactionMessage)
  }

  return await logger.telegram(`Could not understand message: ${MESSAGE.text}`)
  
};
  