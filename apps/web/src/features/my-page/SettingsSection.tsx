"use client";

import { Button, TextArea, TextInput } from "@ui/components/client";
import { Body, Heading, HintText, Label } from "@ui/components/server";
import type { UserProfile } from "@core/my-page/api";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { safeImageSrc } from "@/utils/image";

interface SettingsSectionProps {
  profile: UserProfile;
}

export function SettingsSection({ profile }: SettingsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [introduction, setIntroduction] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setIntroduction("");
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <section className="mx-auto w-full max-w-[960px]">
      <div className="border-border-gray-light mb-6 border-b pb-3">
        <Label size="m" weight="bold" className="text-text-primary">
          계정 설정
        </Label>
      </div>

      <div className="flex flex-col gap-4">
        <section className="rounded-3 border-border-gray-light bg-surface-white border p-6 md:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Heading size="xs">기본 정보</Heading>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="tertiary" size="small" onClick={handleCancel}>
                  취소
                </Button>
                <Button size="small" onClick={handleSave}>
                  저장
                </Button>
              </div>
            ) : (
              <Button
                variant="tertiary"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                수정
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid gap-3 md:grid-cols-[112px_minmax(0,1fr)] md:items-start">
              <Label size="m" className="text-text-basic">
                이미지
              </Label>
              <div className="flex flex-wrap items-center gap-4">
                <ProfileImage
                  userName={profile.user_name}
                  imageUrl={profile.img_url}
                  imagePreview={imagePreview}
                />
                {isEditing && (
                  <div className="flex flex-col gap-2">
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="profile-image"
                      className="rounded-2 border-button-tertiary-border bg-button-tertiary-fill hover:bg-button-tertiary-fill-hover text-text-basic inline-flex min-h-[40px] cursor-pointer items-center justify-center border px-3 text-sm transition-colors"
                    >
                      변경
                    </label>
                    <HintText>
                      JPG, JPEG, PNG 파일만 선택할 수 있습니다.
                    </HintText>
                  </div>
                )}
              </div>
            </div>

            <SettingsRow label="이름">
              {isEditing ? (
                <TextInput
                  id="profile-name"
                  value={profile.user_name}
                  disabled
                  length="full"
                />
              ) : (
                <Body size="m">{profile.user_name}</Body>
              )}
            </SettingsRow>

            <SettingsRow label="학번">
              {isEditing ? (
                <TextInput
                  id="profile-student-id"
                  value={String(profile.user_id)}
                  disabled
                  length="full"
                />
              ) : (
                <Body size="m">{profile.user_id}</Body>
              )}
            </SettingsRow>

            <SettingsRow label="학과">
              {isEditing ? (
                <TextInput
                  id="profile-department"
                  value={profile.department}
                  disabled
                  length="full"
                />
              ) : (
                <Body size="m">{profile.department}</Body>
              )}
            </SettingsRow>

            <SettingsRow label="자기소개">
              {isEditing ? (
                <TextArea
                  id="profile-introduction"
                  value={introduction}
                  onChange={(event) => setIntroduction(event.target.value)}
                  placeholder="나만의 스킬, 취향, 링크 등으로 소개글을 작성해보세요."
                  size="large"
                  maxLength={500}
                />
              ) : (
                <Body size="m" className="text-text-subtle">
                  {introduction ||
                    "나만의 스킬, 취향, 링크 등으로 소개글을 작성해보세요."}
                </Body>
              )}
            </SettingsRow>
          </div>
        </section>

        <section className="rounded-3 border-border-gray-light bg-surface-white border p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Heading size="xs">추가 정보</Heading>
            <Button variant="tertiary" size="small" disabled>
              수정
            </Button>
          </div>
          <div className="flex flex-col gap-5">
            <SettingsRow label="이메일">
              <Body size="m">{profile.email}</Body>
            </SettingsRow>
            <SettingsRow label="휴대폰 번호">
              <Body size="m">{profile.phone_num}</Body>
            </SettingsRow>
          </div>
        </section>

        <Button variant="tertiary" size="small" disabled className="w-fit">
          로그아웃
        </Button>
      </div>
    </section>
  );
}

function SettingsRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[112px_minmax(0,1fr)] md:items-center md:gap-3">
      <Label size="m" className="text-text-basic">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ProfileImage({
  userName,
  imageUrl,
  imagePreview,
}: {
  userName: string;
  imageUrl: string | null;
  imagePreview: string | null;
}) {
  if (imagePreview) {
    return (
      <div
        role="img"
        aria-label={`${userName} 프로필 이미지 미리보기`}
        className="rounded-2 h-24 w-24 bg-cover bg-center"
        style={{ backgroundImage: `url(${imagePreview})` }}
      />
    );
  }

  if (safeImageSrc(imageUrl)) {
    return (
      <Image
        src={safeImageSrc(imageUrl)!}
        alt={`${userName} 프로필 이미지`}
        width={96}
        height={96}
        className="rounded-2 h-24 w-24 object-cover"
      />
    );
  }

  return (
    <CircleUser className="text-border-gray-light h-24 w-24" strokeWidth={1} />
  );
}
