import { Bone } from "./Bone";

/**
 * 인증 처리 중 스켈레톤 (로그인 콜백, 회원가입 완료 등)
 */
export function AuthSkeleton() {
  return (
    <div className="min-h-viewport flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Bone className="h-16 w-16 rounded-full" />
        <Bone className="h-6 w-48" />
        <Bone className="h-4 w-32" />
      </div>
    </div>
  );
}
