import Image from "next/image";
import Link from "next/link";

type SvgBannerProps = {
  href: string;
  image: {
    alt: string;
    desktop: { src: string; width: number; height: number };
    mobile?: { src: string; width: number; height: number };
  };
};

export function SvgBanner({ href, image }: SvgBannerProps) {
  return (
    <Link href={href} className="block h-full w-full" aria-label={image.alt}>
      {image.mobile && (
        <Image
          src={image.mobile.src}
          alt={image.alt}
          width={image.mobile.width}
          height={image.mobile.height}
          className="h-full w-full object-cover md:hidden"
        />
      )}
      <Image
        src={image.desktop.src}
        alt={image.alt}
        width={image.desktop.width}
        height={image.desktop.height}
        className={
          image.mobile
            ? "hidden h-full w-full object-cover md:block"
            : "h-full w-full object-cover"
        }
      />
    </Link>
  );
}
