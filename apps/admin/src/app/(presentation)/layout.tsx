// 발표 화면 전용 레이아웃. 대시보드 사이드바를 렌더링하지 않는다.
// 루트 레이아웃의 폰트, 세션, 테마 provider는 그대로 상속한다.
export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
