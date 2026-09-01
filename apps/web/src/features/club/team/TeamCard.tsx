"use client";

import { useEffect, useState } from "react";
import { Badge } from "@ui/components/server";
import Image from "next/image";
import { safeImageSrc } from "@/utils/image";
import type { TeamMember } from "./types";

const DEFAULT_PROFILE_IMAGE_SRC = "/forif-circle.svg";

const getIntroTags = (introTag: string | null) =>
  (introTag ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export function TeamCard({ member }: { member: TeamMember }) {
  const [hovered, setHovered] = useState(false);
  const profileImageSrc =
    safeImageSrc(member.prof_img_url) ?? DEFAULT_PROFILE_IMAGE_SRC;
  const [imageSrc, setImageSrc] = useState(profileImageSrc);
  const introTags = getIntroTags(member.intro_tag);
  const overlayText = [
    `${member.act_year}-${member.act_semester}`,
    member.club_department,
    member.user_title,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    setImageSrc(profileImageSrc);
  }, [profileImageSrc]);

  return (
    <div
      className="rounded-3 border-border-gray-light bg-surface-white focus-visible:ring-primary-20 relative flex cursor-pointer flex-col overflow-hidden border px-6 pb-6 pt-14 text-center shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setHovered((prev) => !prev);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${member.user_name} 운영진 정보`}
    >
      <div className="mx-auto mb-5 flex justify-center">
        <Image
          src={imageSrc}
          alt={member.user_name || "FORIF 운영진"}
          width={120}
          height={120}
          unoptimized
          className="h-[120px] w-[120px] rounded-full object-cover"
          onError={() => {
            if (imageSrc !== DEFAULT_PROFILE_IMAGE_SRC) {
              setImageSrc(DEFAULT_PROFILE_IMAGE_SRC);
            }
          }}
        />
      </div>

      <div className="flex min-h-[140px] flex-col items-center justify-center">
        <p className="text-text-basic text-xl font-bold">{member.user_name}</p>
        <p className="text-text-subtle mb-3 text-sm">
          {member.club_department}
        </p>
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {member.user_title && (
            <Badge
              label={member.user_title}
              variant="primary"
              appearance="solid-pastel"
              size="small"
            />
          )}
          {introTags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              label={tag}
              variant="info"
              appearance="solid-pastel"
              size="small"
            />
          ))}
        </div>
        <p className="text-text-subtle line-clamp-2 text-sm">
          {member.self_intro}
        </p>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-900/75 px-6 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-sm font-semibold leading-6 text-white">
          {overlayText}
        </p>
      </div>
    </div>
  );
}
