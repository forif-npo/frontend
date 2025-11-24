"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, TextInput } from "@ui/components/client";
import { InfoText, Label } from "@ui/components/server";
import { setAccessToken } from "@core/auth/token";

export default function MentorLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("staff-credentials", {
        userId,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (result?.ok) {
        // 세션에서 백엔드 JWT 가져와서 메모리에 저장
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session?.accessToken) {
          setAccessToken(session.accessToken);
        }

        router.push("/my");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="border-divider-gray-light rounded-3 flex flex-col gap-6 border px-10 py-8 shadow">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-6"
        >
          <TextInput
            id="userId"
            length="full"
            title="학번"
            placeholder="2023063845"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isLoading}
          />
          <TextInput
            id="password"
            type="password"
            length="full"
            title="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {error && (
            <Label size="s" className="text-text-danger">
              {error}
            </Label>
          )}
          <Button type="submit" size="large" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <InfoText>
          알림톡을 통해 전달된 아이디와 비밀번호를 사용해주세요. 아이디 또는
          비밀번호를 찾을 수 없다면 운영진에게 문의해주세요.
        </InfoText>
      </div>
    </div>
  );
}
