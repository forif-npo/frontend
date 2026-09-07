import { useEffect, useRef, useState } from "react";
import type { UserInfo } from "./types";

type FetchUserInfo = (studentId: string) => Promise<UserInfo | null>;

interface UseSecondaryMentorOptions {
  currentUserInfo: UserInfo | null;
  secondaryMentorId: number | null;
  onMentorIdsChange: (mentorIds: number[]) => void;
  fetchUser: FetchUserInfo;
}

export function useSecondaryMentor({
  currentUserInfo,
  secondaryMentorId,
  onMentorIdsChange,
  fetchUser,
}: UseSecondaryMentorOptions) {
  const [mentorSearchValue, setMentorSearchValue] = useState("");
  const [secondaryMentor, setSecondaryMentor] = useState<UserInfo | null>(null);
  const [mentorError, setMentorError] = useState<string | null>(null);
  const latestSearchRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++latestSearchRequestId.current;

    if (secondaryMentorId === null) {
      setSecondaryMentor(null);
      return;
    }

    let isCanceled = false;
    const loadSecondaryMentor = async () => {
      try {
        const mentor = await fetchUser(String(secondaryMentorId));
        if (isCanceled || requestId !== latestSearchRequestId.current) return;

        setSecondaryMentor(mentor);
        setMentorSearchValue(mentor?.studentId ?? String(secondaryMentorId));
      } catch {
        if (isCanceled || requestId !== latestSearchRequestId.current) return;
        setSecondaryMentor(null);
      }
    };

    void loadSecondaryMentor();
    return () => {
      isCanceled = true;
    };
  }, [fetchUser, secondaryMentorId]);

  const updateMentorSearchValue = (value: string) => {
    latestSearchRequestId.current += 1;
    setMentorSearchValue(value);
    setMentorError(null);
  };

  const handleSecondaryMentorSearch = async () => {
    const mentorId = mentorSearchValue.trim();
    if (!mentorId) return;
    const requestId = ++latestSearchRequestId.current;

    try {
      const mentor = await fetchUser(mentorId);
      if (requestId !== latestSearchRequestId.current) return;

      if (!mentor) {
        throw new Error("Mentor not found");
      }
      if (!currentUserInfo) {
        setMentorError("사용자 정보를 불러온 뒤 다시 시도해주세요.");
        return;
      }
      if (mentor.studentId === currentUserInfo.studentId) {
        setSecondaryMentor(null);
        setMentorError("본인은 추가 멘토로 등록할 수 없습니다.");
        onMentorIdsChange([]);
        return;
      }

      setSecondaryMentor(mentor);
      setMentorSearchValue(mentor.studentId);
      setMentorError(null);
      onMentorIdsChange([Number(mentor.studentId)]);
    } catch {
      if (requestId !== latestSearchRequestId.current) return;

      setMentorError("해당 아이디의 부원을 찾을 수 없습니다.");
    }
  };

  const handleSecondaryMentorRemove = () => {
    latestSearchRequestId.current += 1;
    setSecondaryMentor(null);
    setMentorSearchValue("");
    setMentorError(null);
    onMentorIdsChange([]);
  };

  return {
    mentorSearchValue,
    secondaryMentor,
    mentorError,
    updateMentorSearchValue,
    handleSecondaryMentorSearch,
    handleSecondaryMentorRemove,
  };
}
