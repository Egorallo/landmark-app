import { auth } from './firebaseInit';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fireSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { ERROR_MESSAGES } from '../constants/errors';

type ErrorCode = keyof typeof ERROR_MESSAGES;

function isAuthError(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

function passError(error: unknown): { failed: true; message: string } {
  if (isAuthError(error)) {
    const message =
      ERROR_MESSAGES[error.code as ErrorCode] || 'An unknown error occurred, refresh the page';
    return { failed: true, message };
  }
  return { failed: true, message: 'An unknown error occurred, refresh the page' };
}

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject,
    );
  });
};

export async function signIn(email: string, password: string) {
  try {
    const userCreds = await signInWithEmailAndPassword(auth, email, password);
    return userCreds;
  } catch (error) {
    passError(error);
  }
}

export async function signUp(email: string, password: string) {
  try {
    const userCreds = await createUserWithEmailAndPassword(auth, email, password);
    return userCreds;
  } catch (error) {
    passError(error);
  }
}

export async function signOut() {
  try {
    await fireSignOut(auth);
  } catch (error) {
    passError(error);
  }
}
