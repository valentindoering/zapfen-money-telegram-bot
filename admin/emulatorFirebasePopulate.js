// const admin = require('firebase-admin');

// var serviceAccount = require("./app-fantamusie-firebase-adminsdk-3sof4-8175373ba9.json");

// // Set the FIRESTORE_EMULATOR_HOST environment variable
// process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

// if (!process.env.FIRESTORE_EMULATOR_HOST) {
//     throw new Error('You must set FIRESTORE_EMULATOR_HOST to use this script. Run "export FIRESTORE_EMULATOR_HOST=localhost:8080" before');
//   }

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });


// async function sendMessage(text) {
//     try {
//       // Get a reference to the Firestore database
//       const db = admin.firestore();
  
//       // Get a reference to the 'sessions' collection
//       const sessionsRef = db.collection('zapfenStore');
  
//       // Get the first document in the 'sessions' collection
//       const snapshot = await sessionsRef.limit(1).get();
//       const firstDoc = snapshot.docs[0];
  
//       if (!firstDoc) {
//         console.log('No sessions document found.');
//         return;
//       }
  
//       const data = [
//         {
//             name: "Adrian",
//             zapfen ...
//         }
//       ]
  
//       // Create a new document in the 'messages' collection
//       const messageDocRef = await messagesRef.add({
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         fileUrl: "",
//         isBot: false,
//         text: text,
//         type: "text",
//       });
  
//       console.log('New message document created with ID:', messageDocRef.id);
//     } catch (error) {
//       console.error('Error populating Firestore:', error);
//     }
//   }
  
// // Get the command line arguments
// const args = process.argv.slice(2);

// // If a text argument was provided, use that, otherwise use 'Hello World'
// const text = args[0] || 'Hello World';

// sendMessage(text);