import clsx from "clsx";

export type HeadingProps<E extends React.ElementType> = {
  size?: "xl" | "l" | "m" | "s" | "xs" | "xxs";
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<E>;

export const Heading = <E extends React.ElementType = "h2">({
  size = "m",
  children,
  className = "",
  ...props
}: HeadingProps<E>) => {
  const sizeClass = {
    xl: "text-heading-xl-mobile sm:text-heading-xl",
    l: "text-heading-l-mobile sm:text-heading-l",
    m: "text-heading-m-mobile sm:text-heading-m",
    s: "text-heading-s-mobile sm:text-heading-s",
    xs: "text-heading-xs-mobile sm:text-heading-xs",
    xxs: "text-heading-xxs-mobile sm:text-heading-xxs",
  }[size];
  const weightClass = "font-bold";

  return (
    <h2 className={clsx(sizeClass, weightClass, className)} {...props}>
      {children}
    </h2>
  );
};
