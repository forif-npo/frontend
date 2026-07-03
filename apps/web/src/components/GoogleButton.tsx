"use client";
import React from "react";
import { AuthButton, type AuthButtonProps } from "./AuthButton";

const GOOGLE_LOGO = {
  src: "/google_logo.png",
  alt: "Google Logo",
  width: 24,
  height: 24,
};

export const GoogleButton = <E extends React.ElementType = "button">(
  props: Omit<AuthButtonProps<E>, "logo">,
) => <AuthButton logo={GOOGLE_LOGO} {...props} />;
