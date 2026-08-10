import { ForifIntroBanner } from "@/features/home/banners/ForifIntroBanner";
import { SvgBanner } from "@/features/home/banners/SvgBanner";

type ResponsiveBannerImage = {
  alt: string;
  desktop: { src: string; width: number; height: number };
  mobile: { src: string; width: number; height: number };
};

export const HOME_CAROUSEL_BANNER_SPEC = {
  desktop: { width: 1200, height: 300 },
  mobile: { width: 360, height: 360 },
} as const;

/**
 * Banner asset contract:
 * - desktop SVG: 1200 x 300 px
 * - mobile SVG: 360 x 360 px
 * The carousel applies the rounded corners, so source SVGs must keep their
 * outer canvas rectangular and should not include an outer corner radius.
 */

export type HomeCarouselBanner =
  | { id: string; type: "tsx"; component: typeof ForifIntroBanner }
  | {
      id: string;
      type: "svg";
      component: typeof SvgBanner;
      href: string;
      image: ResponsiveBannerImage;
    };

export const HOME_CAROUSEL_BANNERS: HomeCarouselBanner[] = [
  {
    id: "forif-intro",
    type: "tsx",
    component: ForifIntroBanner,
  },
];
