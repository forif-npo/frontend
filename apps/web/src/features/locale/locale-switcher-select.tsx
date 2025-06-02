"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@ui/components/client";
import clsx from "clsx";
import { Locale } from "next-intl";
import { useParams } from "next/navigation";
import { ChangeEvent, ReactNode, useTransition } from "react";

type Props = {
  children: ReactNode;
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale },
      );
    });
  }

  return (
    <Button variant="text" size="x-small">
      <label
        className={clsx(
          "text-text-basic relative",
          isPending && "transition-opacity [&:disabled]:opacity-30",
        )}
      >
        <p className="sr-only">{label}</p>
        <select
          id="locale-select"
          className="inline-flex cursor-pointer py-2"
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
      </label>
    </Button>
  );
}
