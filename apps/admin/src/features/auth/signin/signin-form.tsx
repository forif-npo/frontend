"use client";

import { Button, TextInput } from "@ui/components/client";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export function SignInForm() {
  const router = useRouter();
  const { update } = useSession();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        id: userId,
        password,
        redirect: false,
        redirectTo: "/",
      });

      if (!result?.ok || result.error) {
        setError("학번 또는 비밀번호가 올바르지 않습니다.");
        return;
      }

      await update();
      router.replace(result.url ?? "/");
    } catch {
      setError("로그인에 실패했습니다.");
    } finally {
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
        placeholder="2024111111"
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
