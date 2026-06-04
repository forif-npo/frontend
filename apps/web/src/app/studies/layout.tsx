import { StudyBreadcrumb } from "@/components/study/StudyBreadcrumb";

interface StudyLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ study_id?: string }>;
}

export default function StudyLayout({ children }: StudyLayoutProps) {
  return (
    <div className="max-w-main mx-auto w-full px-4 pt-10 lg:px-0">
      <StudyBreadcrumb />
      {children}
    </div>
  );
}
