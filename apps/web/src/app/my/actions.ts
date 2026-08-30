"use server";

import { auth } from "@/auth";
import {
  updateUserPhoneNumber,
  updateUserProfile,
} from "@/features/my-page/api";

interface UpdateMyProfileInput {
  profile?: {
    department: string;
    profile_image: File | null;
  };
  phone_num?: string;
}

export async function updateMyProfile({
  profile,
  phone_num,
}: UpdateMyProfileInput): Promise<void> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("로그인이 필요합니다.");
  }

  if (profile) {
    await updateUserProfile(profile, session.accessToken);
  }

  if (phone_num) {
    await updateUserPhoneNumber({ phone_num }, session.accessToken);
  }
}
