import { InstagramIcon, KakaotalkIcon } from "@repo/assets/icons/krds";
import { ChevronRight, Github } from "@repo/assets/icons/lucide";
import { Body, Link } from "@ui/components/server";
import Image from "next/image";

const NAV_LOGO_SRC = "/black_title.svg";

const SOCIAL_LINKS = {
  github: "https://github.com/forif-npo",
  instagram: "https://www.instagram.com/forif_hyu/",
  kakaotalk: "https://pf.kakao.com/_xnRxhxmG",
} as const;

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
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF GitHub"
          >
            <Github size={36} strokeWidth={1.5} className="text-text-basic" />
          </a>

          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FORIF Instagram"
            className="border-border-gray-light rounded-full border p-2"
          >
            <InstagramIcon width={24} height={24} />
          </a>

          <a
            href={SOCIAL_LINKS.kakaotalk}
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
            <Body size="m">
              (04763) 서울 성동구 왕십리로 222 한양대학교 대운동장 지하2층
              B214호
            </Body>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Body size="m" weight="bold" className="shrink-0">
                  이메일
                </Body>
                <Body size="m">contact@forif.org</Body>
              </div>
              <div className="flex items-center gap-2">
                <Body size="m" weight="bold" className="shrink-0">
                  회장 연락처
                </Body>
                <Body size="m">010-3981-2273</Body>
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
