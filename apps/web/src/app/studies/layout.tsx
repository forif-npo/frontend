import { StudyBreadcrumb } from "@/components/study/StudyBreadcrumb";

interface StudyLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ study_id?: string }>;
}

export default function StudyLayout({ children }: StudyLayoutProps) {
  return (
    <div className="max-w-main mx-auto max-md:px-4">
      <StudyBreadcrumb />
      {children}
    </div>
  );
}
