"use client";

import { signInAction } from "@/features/auth/signin/action";
import { Button, TextInput } from "@ui/components/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInForm() {
  const [userId, setUserId] = useState("2024111111");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInAction(userId, password);

      if (result?.ok) {
        // 세션을 즉시 갱신
        await update();
        router.push("/");
      } else if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch {
      setError("로그인에 실패했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col justify-center gap-6"
      onSubmit={handleSubmit}
    >
      <TextInput
        autoComplete="id"
        id="id"
        length="full"
        title="아이디"
        placeholder="2023063845"
        value={userId}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setUserId(e.target.value)
        }
        disabled={isLoading}
      />
      <TextInput
        autoComplete="current-password"
        type="password"
        length="full"
        title="비밀번호"
        id="password"
        placeholder="*********"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        disabled={isLoading}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" size="large" disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
