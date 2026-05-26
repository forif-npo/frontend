import { Breadcrumb } from "@ui/components/server";

export default function AccountingPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-20">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "홈", href: "/" },
            { label: "동아리", href: "/club" },
            { label: "회계" },
          ]}
        />
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">회계 공시</h1>
        <p className="mt-2 text-sm text-gray-500">
          포리프는 투명한 회계를 지향합니다.
        </p>
      </div>

      <div className="py-20 text-center text-gray-400">
        회계 내역은 준비 중입니다.
      </div>
    </div>
  );
}
