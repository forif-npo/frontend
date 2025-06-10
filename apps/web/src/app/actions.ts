"use server";
import { auth, signIn } from "@/auth";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export { auth as getSession };
