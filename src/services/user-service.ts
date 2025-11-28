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

// Gets the current generation count for a user.
// Resets the count if the date has changed.
export async function getGenerationCount(userId: string): Promise<number> {
  const userDocRef = doc(db, "users", userId);
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
export async function incrementGenerationCount(userId: string): Promise<void> {
  const userDocRef = doc(db, "users", userId);
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
