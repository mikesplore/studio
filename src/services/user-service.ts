// src/services/user-service.ts
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

type UserLimitData = {
  generationCount: number;
  lastGenerationDate: string;
};

// Sanitize email to use as Firestore document ID
function sanitizeEmail(email: string): string {
  return email.replace(/[.]/g, "_").replace(/@/g, "_at_").toLowerCase();
}

// Gets the current generation count for a user.
// Resets the count if the date has changed.
// Now uses email as identifier instead of userId
export async function getGenerationCount(emailOrUserId: string): Promise<number> {
  // If it looks like an email, sanitize it; otherwise use as-is for backward compatibility
  const docId = emailOrUserId.includes("@") ? sanitizeEmail(emailOrUserId) : emailOrUserId;
  const userDocRef = doc(db, "users", docId);
  const userDoc = await getDoc(userDocRef);
  const today = new Date().toISOString().split("T")[0];

  if (!userDoc.exists()) {
    // First time user, create their document
    await setDoc(userDocRef, {
      generationCount: 0,
      lastGenerationDate: today,
      createdAt: serverTimestamp(),
    });
    return 0;
  }

  const data = userDoc.data() as UserLimitData;

  if (data.lastGenerationDate !== today) {
    // It's a new day, reset the counter
    await updateDoc(userDocRef, {
      generationCount: 0,
      lastGenerationDate: today,
    });
    return 0;
  }

  return data.generationCount;
}

// Increments the generation count for a user.
// Now uses email as identifier instead of userId
export async function incrementGenerationCount(emailOrUserId: string): Promise<void> {
  // If it looks like an email, sanitize it; otherwise use as-is for backward compatibility
  const docId = emailOrUserId.includes("@") ? sanitizeEmail(emailOrUserId) : emailOrUserId;
  const userDocRef = doc(db, "users", docId);
  const userDoc = await getDoc(userDocRef);
  const today = new Date().toISOString().split("T")[0];

  if (!userDoc.exists() || userDoc.data()?.lastGenerationDate !== today) {
    // If doc doesn't exist or it's a new day, set count to 1
    await setDoc(userDocRef, {
      generationCount: 1,
      lastGenerationDate: today,
    }, { merge: true });
  } else {
    // Otherwise, increment the existing count
    await updateDoc(userDocRef, {
      generationCount: increment(1),
      lastGenerationDate: today,
    });
  }
}
