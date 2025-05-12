import { i18n } from "@repo/core/i18n.config";
import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const langParams = {
  locale: parseAsStringLiteral(i18n.locales).withDefault(i18n.defaultLocale),
};

export const langParamsCache = createSearchParamsCache(langParams);
