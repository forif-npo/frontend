"use client";
import { HighContrastNavLogo, NavLogo } from "@repo/assets/images";
import Image from "next/image";

function ThemedNavLogo() {
  return (
    <>
      <div data-hide-on-theme="high-contrast">
        <Image src={NavLogo} width={87} height={56} alt="FORIF Logo" />
      </div>

      <div data-hide-on-theme="light">
        <Image
          src={HighContrastNavLogo}
          width={87}
          height={56}
          alt="FORIF Logo"
        />
      </div>
    </>
  );
}

export default ThemedNavLogo;
