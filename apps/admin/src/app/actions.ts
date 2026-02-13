"use server";
import { auth, signIn, signOut } from "@/auth";
import { SignUpValues } from "@core/schemas";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export const signUp = async (data: SignUpValues) => {
  // throw new Error("Unknown error")
  console.log(data);
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/signin" });
};

export { auth as getSession };
