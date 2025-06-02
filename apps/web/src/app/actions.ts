"use server";
import { auth, signIn } from "@/auth";
import { SignUpValues } from "@core/schemas";

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/signup" });
};

export const signUp = async (data: SignUpValues) => {
  // throw new Error("Unknown error")
  console.log(data);
};

export { auth as getSession };
