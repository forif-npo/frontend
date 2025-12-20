import { auth } from "@/auth";
import { LogoutButton } from "@/features/auth/logout/logout-button";

export default async function MyPage() {
  const session = await auth();

  // NextAuth 세션이 없어도 됨 (localStorage의 JWT로 인증)
  // Middleware에서 이미 체크함

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">마이페이지</h1>
      {session?.user && (
        <div className="mb-6">
          <p>이름: {session.user.name}</p>
          <p>이메일: {session.user.email}</p>
        </div>
      )}
      <LogoutButton />
    </div>
  );
}
