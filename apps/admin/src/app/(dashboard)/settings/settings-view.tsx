"use client";

import { useState } from "react";
import { toast } from "sonner";
import { signOutAction } from "@/app/actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleApiError } from "@core/utils/api-client";
import { passwordSchema } from "@core/schemas";
import { changeAdminPassword } from "./api";

export function SettingsView() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!currentPassword || !newPassword || !passwordConfirmation) {
      toast.error("모든 비밀번호 항목을 입력해주세요.");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
      return;
    }
    const passwordValidation = passwordSchema.safeParse(newPassword);
    if (!passwordValidation.success) {
      toast.error(
        passwordValidation.error.issues[0]?.message ??
          "비밀번호 형식이 올바르지 않습니다.",
      );
      return;
    }
    if (newPassword !== passwordConfirmation) {
      toast.error("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changeAdminPassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
      await signOutAction();
    } catch (error) {
      toast.error(await handleApiError(error));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title="설정"
        description="운영진 계정의 비밀번호를 변경합니다. 변경 후 다시 로그인해주세요."
      />

      <section className="max-w-xl rounded-lg border p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="current-password">현재 비밀번호</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-muted-foreground text-xs">
              8~20자, 대문자·소문자·숫자·특수문자 중 2가지 이상을 사용해주세요.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password-confirmation">새 비밀번호 확인</Label>
            <Input
              id="new-password-confirmation"
              type="password"
              autoComplete="new-password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </form>
      </section>
    </div>
  );
}
