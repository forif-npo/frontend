"use client";
import { Button } from "@ui/components/client";
import { TextInput } from "@ui/components/server";
import { useRouter } from "next/navigation";

export function SignInForm() {
  const router = useRouter();
  return (
    <form
      className="flex flex-col justify-center gap-6"
      onSubmit={() => router.push("/")}
    >
      <TextInput
        autoComplete="id"
        id="id"
        length="full"
        title="아이디"
        placeholder=""
        // error={errors.email?.message ? errors.email?.message : undefined}
        // {...register("email")}
        // value={email}
      />
      <TextInput
        autoComplete="current-password"
        type="password"
        length="full"
        title="비밀번호"
        id="password"
        placeholder="*********"
        // error={errors.name?.message}
        // disabled={isPending}
        // {...register("name")}
      />
      <Button type="submit" size="large" disabled={false}>
        로그인
      </Button>
    </form>
  );
}
