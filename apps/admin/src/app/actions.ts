"use server";
import { auth, signIn, signOut } from "@/auth";
import { SignUpValues } from "@core/schemas";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export const signUp = async (_data: SignUpValues) => {
  void _data;
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/signin" });
};

export { auth as getSession };
