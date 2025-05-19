import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./locale-switcher-select";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const options = routing.locales.map((cur) => {
    return {
      label: cur.toString(),
      value: cur.toString(),
    };
  });

  return (
    <LocaleSwitcherSelect defaultValue={locale} label={t("label")}>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className={`rounded-2 text-text-basic w-full px-5 text-left outline-none`}
          role="option"
        >
          {t("locale", { locale: option.label })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
}
