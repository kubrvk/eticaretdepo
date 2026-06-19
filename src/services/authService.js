import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { ensureSeedAccounts, findLocalAccountByEmail, loginLocalAccount, registerLocalAccount } from "./accountService";

const shapeUser = (accountLike) => ({
  uid: accountLike.uid || accountLike.id || `local-${accountLike.email}`,
  email: accountLike.email,
  fullName: accountLike.fullName || accountLike.displayName || accountLike.email,
  companyName: accountLike.companyName || accountLike.fullName || "Bireysel Hesap",
  role: accountLike.role || "dealer",
  approved: accountLike.approved ?? true,
});

export const registerUser = async ({ email, password, fullName, companyName }) => {
  ensureSeedAccounts();
  const localAccount = registerLocalAccount({ email, password, fullName, companyName });

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return shapeUser({
      ...localAccount,
      uid: userCredential.user.uid,
    });
  } catch (error) {
    console.warn("Firebase registration unavailable, local account will be used.", error);
    return shapeUser(localAccount);
  }
};

export const loginUser = async ({ email, password }) => {
  ensureSeedAccounts();
  const localAccount = findLocalAccountByEmail(email);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return shapeUser({
      ...localAccount,
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      fullName: localAccount?.fullName || userCredential.user.email,
      companyName: localAccount?.companyName || "Bireysel Hesap",
      role: localAccount?.role || "dealer",
    });
  } catch (error) {
    console.warn("Firebase login unavailable, trying local account.", error);
    return shapeUser(loginLocalAccount({ email, password }));
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Firebase logout unavailable, local session cleared only.", error);
  }
};
