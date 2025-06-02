"use server";
import { auth, signIn } from "@/auth";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export { auth as getSession };
