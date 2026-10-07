import { ForifIntroBanner } from "@/features/home/banners/ForifIntroBanner";
import { MentorRecruitBanner } from "@/features/home/banners/MentorRecruitBanner";
import { SvgBanner } from "@/features/home/banners/SvgBanner";
import { FORIF_EXTERNAL_LINKS } from "@/constants/external-links";

type ResponsiveBannerImage = {
  alt: string;
  desktop: { src: string; width: number; height: number };
  mobile?: { src: string; width: number; height: number };
};

export const HOME_CAROUSEL_BANNER_SPEC = {
  desktop: { width: 1200, height: 300 },
  mobile: { width: 360, height: 360 },
} as const;

/**
 * Banner asset contract:
 * - desktop SVG: 1200 x 300 px
 * - mobile SVG: 360 x 360 px (optional; omit to use the desktop SVG on mobile)
 * The carousel applies the rounded corners, so source SVGs must keep their
 * outer canvas rectangular and should not include an outer corner radius.
 */

export type HomeCarouselBanner =
  | {
      id: string;
      disabled?: boolean;
      type: "tsx";
      component: typeof MentorRecruitBanner | typeof ForifIntroBanner;
      mobileAspect?: "square" | "desktop";
    }
  | {
      id: string;
      disabled?: boolean;
      type: "svg";
      component: typeof SvgBanner;
      href: string;
      image: ResponsiveBannerImage;
      mobileAspect?: "square" | "desktop";
      desktopAspect?: "wide";
    };

export const HOME_CAROUSEL_BANNERS: HomeCarouselBanner[] = [
  {
    id: "tech-blog-event-2026-2",
    type: "svg",
    component: SvgBanner,
    href: FORIF_EXTERNAL_LINKS.medium,
    desktopAspect: "wide",
    image: {
      alt: "2026년 2학기 포리프 기술블로그 백일장",
      desktop: {
        src: "/banner/2026-tech-blog/2026-2-tech-blog-event-desktop.svg",
        width: 1200,
        height: 300,
      },
      mobile: {
        src: "/banner/2026-tech-blog/2026-2-tech-blog-event-mobile.svg",
        width: 360,
        height: 360,
      },
    },
  },
  {
    id: "study-apply-2026-2",
    disabled: true,
    type: "svg",
    component: SvgBanner,
    href: "/studies/list",
    mobileAspect: "desktop",
    desktopAspect: "wide",
    image: {
      alt: "2026년 2학기 포리프 스터디 신청",
      desktop: {
        src: "/banner/2026-recruting/2026-2-study-apply-desktop.svg",
        width: 1200,
        height: 300,
      },
    },
  },
  {
    id: "forif-intro",
    type: "tsx",
    component: ForifIntroBanner,
    mobileAspect: "desktop",
  },
  {
    id: "mentor-recruit-2026-2",
    disabled: true,
    type: "tsx",
    component: MentorRecruitBanner,
    mobileAspect: "desktop",
  },
];
