import firebase from 'firebase'


const config = {
  apiKey: "AIzaSyBy6fFMIToaiUSGEuaXfxMZga3kJWc4_3U",
  authDomain: "chat-app-1e5ec.firebaseapp.com",
  databaseURL: "https://chat-app-1e5ec.firebaseio.com",
  projectId: "chat-app-1e5ec",
  storageBucket: "chat-app-1e5ec.appspot.com",
  messagingSenderId: "101111176758",
  appId: "1:101111176758:web:02103bb6bf85065a09c297",
  measurementId: "G-W70764WW8B"
  };
  firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
export const dbf =firebase.firestore();
export const storage = firebase.storage().ref();