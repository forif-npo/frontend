import { StudyBreadcrumb } from "@/components/study/StudyBreadcrumb";

interface StudyLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ study_id?: string }>;
}

export default function StudyLayout({ children, params }: StudyLayoutProps) {
  return (
    <div className="container mx-auto">
      <StudyBreadcrumb />
      {children}
    </div>
  );
}
