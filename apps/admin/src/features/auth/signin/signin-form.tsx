"use client";
import { Button } from "@ui/components/client";
import { TextInput } from "@ui/components/server";

export function SignInForm() {
  return (
    <form className="flex flex-col justify-center gap-6">
      <TextInput
        autoComplete="email"
        id="email"
        length="full"
        title="이메일"
        placeholder="standardstar@hanyang.ac.kr"
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
        회원가입
      </Button>
    </form>
  );
}
