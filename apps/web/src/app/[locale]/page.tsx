import LocaleSwitcher from "@/features/locale/locale-switcher";
import { ThemeToggles } from "@repo/core/components";
import { Button } from "@repo/ui/components/client";
import { Label } from "@repo/ui/components/server";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations("HomePage");
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <LocaleSwitcher />
        <ThemeToggles />
        <Button variant="primary" size="small">
          {t("title")}
        </Button>
        <Label>Hi there</Label>
      </main>
    </div>
  );
}
