import { auth } from "../services/firebase";
import {db} from '../services/firebase'
export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password).then( cred => {
    return db.ref('users').push ({
      email: email
    })
  }).then(() => {
    console.log("posted")
  }).catch(e => 
   console.log(e.message)
  );;
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function logout() {
  return auth().signOut();
}
