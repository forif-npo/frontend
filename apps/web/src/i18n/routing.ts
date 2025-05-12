import { i18n } from "@repo/core/i18n.config";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: i18n.locales,

  // Used when no locale matches
  defaultLocale: i18n.defaultLocale,

  localePrefix: "always",
});
