import {
  ChannelTalkIcon,
  InstagramIcon,
  KakaotalkIcon,
} from "@repo/assets/icons/krds";
import { ChevronRight, Github } from "@repo/assets/icons/lucide";
import { Body, Link } from "@ui/components/server";
import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";
import { FORIF_CONTACT_INFO } from "@/constants/organization";
import Image from "next/image";

const NAV_LOGO_SRC = "/black_title.svg";

const UTILITY_LINKS = [
  { label: "찾아오시는 길", href: "/directions" },
] as const;

const POLICY_LINKS = [
  { label: "이용약관", href: "/terms", bold: true },
  { label: "개인정보처리방침", href: "/privacy", bold: true },
] as const;

export function Footer() {
  return (
    <footer className="bg-surface-white border-border-gray-light border-t">
      {/* Main Content */}
      <div className="footer-main max-w-main mx-auto flex flex-col">
        {/* Brand + Social Links */}
        <div className="flex items-center gap-[10px]">
          <Image src={NAV_LOGO_SRC} width={81} height={52} alt="FORIF 로고" />

          <div className="border-divider-gray-light h-7 border-l" />

          <a
            href={FORIF_EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF GitHub"
          >
            <Github size={36} strokeWidth={1.5} className="text-text-basic" />
          </a>

          <a
            href={FORIF_EXTERNAL_LINKS.channelTalk}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF 채널톡"
          >
            <ChannelTalkIcon width={36} height={36} />
          </a>

          <a
            href={FORIF_EXTERNAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF Instagram"
          >
            <InstagramIcon width={36} height={36} />
          </a>

          <a
            href={FORIF_EXTERNAL_LINKS.kakaoTalk}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF 카카오톡"
          >
            <KakaotalkIcon width={36} height={36} />
          </a>
        </div>

        {/* Info + Links */}
        <div className="footer-info-grid flex items-start">
          {/* Address + Contact */}
          <div className="flex flex-1 flex-col gap-4">
            <Body size="m">{FORIF_CONTACT_INFO.address}</Body>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Body size="m" weight="bold" className="shrink-0">
                  이메일
                </Body>
                <Body size="m">{FORIF_CONTACT_INFO.email}</Body>
              </div>
              <div className="flex items-center gap-2">
                <Body size="m" weight="bold" className="shrink-0">
                  회장
                </Body>
                <Body size="m">
                  {FORIF_CONTACT_INFO.presidentName}(
                  {FORIF_CONTACT_INFO.presidentPhone})
                </Body>
              </div>
            </div>
          </div>

          {/* Utility Links */}
          <div className="footer-links-col flex flex-col items-start gap-1">
            {UTILITY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                size="m"
                className="flex h-8 items-center gap-1 px-0.5 no-underline"
              >
                {link.label}
                <ChevronRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-divider-gray-light border-t">
        <div className="footer-copyright max-w-main mx-auto flex">
          <div className="mb-4 flex items-center gap-2">
            {POLICY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                size="s"
                weight={link.bold ? "bold" : "regular"}
                className="px-0.5 no-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Body size="s" className="text-text-subtle">
            Copyright © 2025 FORIF All rights reserved.
          </Body>
        </div>
      </div>
    </footer>
  );
}
