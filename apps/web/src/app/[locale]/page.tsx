import LocaleSwitcher from "@/features/locale/locale-switcher";
import { Button } from "@repo/ui/components/client";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations("HomePage");
  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <LocaleSwitcher />
        <Button variant="primary" size="small">
          안녕하세요.
        </Button>
        <p className="text-primary-10">Hi there</p>
        <p className="text-primary-20">Hi there</p>
        <p className="text-primary-30">Hi there</p>
        <p className="text-primary-40">Hi there</p>
        <p className="text-primary-50">Hi there</p>
      </main>
    </div>
  );
}
