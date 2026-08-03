"use client";

import { updateMyProfile } from "@/app/my/actions";
import { useLogout } from "@/features/auth/logout/use-logout";
import { departmentsOptions } from "@/constants/options.constant";
import { safeImageSrc } from "@/utils/image";
import type { UserProfile } from "@core/my-page/api";
import {
  Button,
  SelectBox,
  Tabs,
  TextArea,
  TextInput,
} from "@ui/components/client";
import { Body, HintText, Label } from "@ui/components/server";
import { CircleUser } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SettingsSectionProps {
  profile: UserProfile;
}

export function SettingsSection({ profile }: SettingsSectionProps) {
  const router = useRouter();
  const { isPending: isLoggingOut, logout } = useLogout();
  const [isEditing, setIsEditing] = useState(false);
  const [department, setDepartment] = useState(profile.department ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_num ?? "");
  const [introduction, setIntroduction] = useState(profile.self_intro ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setDepartment(profile.department ?? "");
    setPhoneNumber(profile.phone_num ?? "");
    setIntroduction(profile.self_intro ?? "");
    setImageFile(null);
    setImagePreview(null);
    setErrorMessage(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    const isProfileChanged =
      department !== (profile.department ?? "") ||
      introduction !== (profile.self_intro ?? "") ||
      imageFile !== null;
    const isPhoneNumberChanged = phoneNumber !== (profile.phone_num ?? "");

    if (!isProfileChanged && !isPhoneNumberChanged) {
      setIsEditing(false);
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      try {
        await updateMyProfile({
          profile: isProfileChanged
            ? {
                department,
                self_intro: introduction,
                profile_image: imageFile,
              }
            : undefined,
          phone_num: isPhoneNumberChanged ? phoneNumber : undefined,
        });
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "정보를 저장하지 못했습니다.",
        );
      }
    });
  };

  return (
    <section className="w-full">
      <Tabs
        tabs={[
          {
            label: "계정 설정",
            content: (
              <div className="pt-6 md:pt-8">
                <section className="rounded-3 border-border-gray-light bg-surface-white border p-6 md:p-8">
                  <div className="flex max-w-[760px] flex-col gap-6">
                    <div className="grid gap-3 md:grid-cols-[112px_minmax(0,1fr)] md:items-start">
                      <Label size="m" className="text-text-basic">
                        프로필 사진
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

                    <SettingsRow label="이메일">
                      {isEditing ? (
                        <TextInput
                          id="profile-email"
                          value={profile.email}
                          disabled
                          length="full"
                        />
                      ) : (
                        <Body size="m">{profile.email}</Body>
                      )}
                    </SettingsRow>

                    <SettingsRow label="학과">
                      {isEditing ? (
                        <SelectBox
                          id="profile-department"
                          value={department}
                          onChange={setDepartment}
                          options={departmentsOptions}
                          placeholder="학과를 선택해주세요."
                          disabled={isPending}
                        />
                      ) : (
                        <Body size="m">{profile.department || "-"}</Body>
                      )}
                    </SettingsRow>

                    <SettingsRow label="휴대폰 번호">
                      {isEditing ? (
                        <TextInput
                          id="profile-phone-number"
                          value={phoneNumber}
                          onChange={(event) =>
                            setPhoneNumber(event.target.value)
                          }
                          placeholder="010-0000-0000"
                          length="full"
                          disabled={isPending}
                        />
                      ) : (
                        <Body size="m">{profile.phone_num || "-"}</Body>
                      )}
                    </SettingsRow>

                    <SettingsRow label="자기소개">
                      {isEditing ? (
                        <TextArea
                          id="profile-introduction"
                          value={introduction}
                          onChange={(event) =>
                            setIntroduction(event.target.value)
                          }
                          placeholder="자기소개를 입력해주세요."
                          size="large"
                          maxLength={500}
                          disabled={isPending}
                        />
                      ) : (
                        <Body size="m">{profile.self_intro || "-"}</Body>
                      )}
                    </SettingsRow>
                  </div>

                  {errorMessage && (
                    <Body size="s" className="text-text-danger mt-5">
                      {errorMessage}
                    </Body>
                  )}
                </section>

                <div
                  className={`mt-4 flex items-center gap-4 ${
                    isEditing ? "justify-end" : "justify-between"
                  }`}
                >
                  {!isEditing && (
                    <Button
                      variant="tertiary"
                      size="small"
                      onClick={logout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                    </Button>
                  )}
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={handleCancel}
                        disabled={isPending}
                      >
                        취소
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSave}
                        disabled={isPending}
                      >
                        저장
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setIsEditing(true)}
                    >
                      수정
                    </Button>
                  )}
                </div>
              </div>
            ),
          },
        ]}
      />
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
