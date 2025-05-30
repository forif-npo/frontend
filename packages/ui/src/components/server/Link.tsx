import NextLink from "next/link";
import { cn } from "../../utils/cn";

export type LinkProps<E extends React.ElementType> = {
  size?: "l" | "m" | "s";
  weight?: "regular" | "bold";
  children: React.ReactNode;
  className?: string;
  title?: string;
} & React.ComponentPropsWithoutRef<E>;

export const Link = <E extends React.ElementType = "a">({
  size = "m",
  weight = "regular",
  children,
  className = "",
  title,
  href,
  ...props
}: LinkProps<E>) => {
  const sizeClass = {
    l: "text-label-l-mobile sm:text-label-l",
    m: "text-label-m-mobile sm:text-label-m",
    s: "text-label-s-mobile sm:text-label-s",
  }[size];

  const weightClass = {
    regular: "font-regular",
    bold: "font-bold",
  }[weight];

  return (
    <NextLink
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(
        "text-text-basic hover:font-semibold",
        sizeClass,
        weightClass,
        className,
      )}
      title={title}
      aria-label={title}
      {...props}
    >
      {children}
    </NextLink>
  );
};
