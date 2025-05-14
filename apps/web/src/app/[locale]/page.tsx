import LocaleSwitcher from "@/features/locale/locale-switcher";
import { Button } from "@repo/ui/components/client";
import { useTranslations } from "next-intl";
export default function Page() {
  const t = useTranslations("HomePage");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
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
