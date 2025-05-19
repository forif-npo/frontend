"use client";
import HighContrastNavLogo from "@repo/assets/images/high_contrast_nav_logo.png";
import NavLogo from "@repo/assets/images/nav_logo.png";
import Image from "next/image";

function ThemedNavLogo() {
  return (
    <>
      <div data-hide-on-theme="high-contrast">
        <Image src={NavLogo} width={87} height={56} alt="Nav Logo" />
      </div>

      <div data-hide-on-theme="light">
        <Image
          src={HighContrastNavLogo}
          width={87}
          height={56}
          alt="Nav Logo"
        />
      </div>
    </>
  );
}

export default ThemedNavLogo;
