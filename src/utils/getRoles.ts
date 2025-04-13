import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getUserRole = async (uid: string): Promise<"admin" | "student" | null> => {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data().role;
    }
    return null;
  } catch (err) {
    console.error("Error fetching role:", err);
    return null;
  }
};
