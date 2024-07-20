import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";

export const getUserByEmail = async (email) => {
  let user = null;

  await getDocs(query(collection(db, "users"), where("email", "==", email)))
    .then((snapshot) => {
      if (snapshot.docs.length > 0)
        user = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
    })
    .catch((error) => console.error(error));

  return user;
};

export const firebaseLogin = async (email, password) => {
  let user = null;

  await signInWithEmailAndPassword(auth, email, password)
    .then((value) => {
      user = value;
    })
    .catch((error) => {
      console.error(error);
    });

  return user;
};

export const firebaseSignup = async (name, email, password, role) => {
  let user = null;

  await createUserWithEmailAndPassword(auth, email, password)
    .then(async (value) => {
      user = value;
      let newUser = {
        created: new Date(),
        email: email,
        name: name,
        role: role,
      };

      await addDoc(collection(db, "users"), newUser);
    })
    .catch((error) => {
      console.error(error);
    });

  return user;
};

export const firebaseSendReset = async (email) => {
  let success = false;

  await sendPasswordResetEmail(auth, email)
    .then(() => {
      success = true;
    })
    .catch((error) => {
      console.error(error);
    });

  return success;
};

export const checkAuthStateChange = (
  navigate,
  redirectToDashboard = false,
  redirectToSignIn = true
) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (redirectToDashboard) navigate("/dashboard");
    } else if (redirectToSignIn) navigate("/signin");
  });
};
