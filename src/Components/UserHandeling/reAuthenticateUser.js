import {
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

export default function reAuthenticateUser(user, email, password) {
  const credential = EmailAuthProvider.credential(email, password);
  const auth = reauthenticateWithCredential(user, credential)
    .then((currentUser) => {
      return true;
    })
    .catch((error) => {
      return false
    });
  return auth;
}