/**
 * 스켈레톤 UI 기본 블록.
 * animate-pulse 로 깜빡이는 회색 바.
 */
export function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2 bg-surface-gray-subtle animate-pulse ${className}`}
    />
  );
}
