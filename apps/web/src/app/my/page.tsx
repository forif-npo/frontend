// import { auth } from "@/auth";
import { MyPageClient } from "./MyPageClient";
// import {
//   getUserProfile,
//   getUserStudies,
//   getStudyApplications,
// } from "@core/my-page/api";
// import { redirect } from "next/navigation";
import type {
  UserProfile,
  UserStudiesResponse,
  StudyApplicationsResponse,
} from "@core/my-page/api";

const MOCK_PROFILE: UserProfile = {
  user_id: 2023063845,
  user_name: "표준성",
  email: "junsung@hanyang.ac.kr",
  phone_num: "010-1234-5678",
  department: "정보시스템학과",
  img_url: null,
  role: "USER",
};

const MOCK_STUDY_BASE = {
  study_name: "이 파이썬 스터디 듣고 개발자되면 책임 못 짐",
  one_liner:
    "참컴, 공장컴. 너 뭐 돼? 내가 파이썬을 안다고? No. 파이썬이 나를 안다고 해라. 이 스터디 듣고 파이썬 마스터하자.",
  img_url: "/images/default-study-img.png",
  primary_mentor_name: "표준성",
  secondary_mentor_name: "양병현",
  tags: ["Python", "프로그래밍"],
  start_time: "17:00",
  end_time: "18:30",
  week_day: 4,
  location: "양병현",
  difficulty: 2,
};

const MOCK_STUDIES: UserStudiesResponse = {
  semesters: [
    {
      year: 2025,
      semester: 2,
      semester_label: "2025-2",
      is_current: true,
      study: { ...MOCK_STUDY_BASE, study_id: 1 },
    },
    {
      year: 2025,
      semester: 1,
      semester_label: "2025-1",
      is_current: false,
      study: { ...MOCK_STUDY_BASE, study_id: 2 },
    },
    {
      year: 2024,
      semester: 2,
      semester_label: "2024-2",
      is_current: false,
      study: { ...MOCK_STUDY_BASE, study_id: 3 },
    },
    {
      year: 2024,
      semester: 1,
      semester_label: "2024-1",
      is_current: false,
      study: { ...MOCK_STUDY_BASE, study_id: 4 },
    },
    {
      year: 2023,
      semester: 2,
      semester_label: "2023-2",
      is_current: false,
      study: { ...MOCK_STUDY_BASE, study_id: 5 },
    },
  ],
};

const MOCK_APPLICATIONS: StudyApplicationsResponse = {
  applications: [
    {
      user_apply_id: 1,
      apply_year: 2025,
      apply_semester: 2,
      apply_date: "2025-09-01",
      apply_path: "WEB",
      pay_status: 1,
      primary_application: {
        priority: "PRIMARY",
        study: { ...MOCK_STUDY_BASE, study_id: 1 },
        status: 1,
        intro:
          "파이썬을 배워서 데이터 분석과 자동화 프로그래밍을 하고 싶습니다. 열심히 하겠습니다!",
      },
      secondary_application: {
        priority: "SECONDARY",
        study: {
          ...MOCK_STUDY_BASE,
          study_id: 6,
          study_name: "React로 웹 프론트엔드 마스터하기",
          one_liner: "React의 기초부터 심화까지 배워보는 스터디입니다.",
        },
        status: 0,
        intro: "프론트엔드 개발에도 관심이 있어서 2순위로 지원합니다.",
      },
    },
    {
      user_apply_id: 2,
      apply_year: 2025,
      apply_semester: 1,
      apply_date: "2025-03-05",
      apply_path: "WEB",
      pay_status: 1,
      primary_application: {
        priority: "PRIMARY",
        study: {
          ...MOCK_STUDY_BASE,
          study_id: 7,
          study_name: "알고리즘 스터디",
          one_liner: "코딩 테스트 준비를 위한 알고리즘 스터디",
        },
        status: 1,
        intro:
          "코딩 테스트 대비를 위해 알고리즘을 체계적으로 공부하고 싶습니다.",
      },
      secondary_application: null,
    },
    {
      user_apply_id: 3,
      apply_year: 2024,
      apply_semester: 2,
      apply_date: "2024-09-02",
      apply_path: "WEB",
      pay_status: 1,
      primary_application: {
        priority: "PRIMARY",
        study: {
          ...MOCK_STUDY_BASE,
          study_id: 8,
          study_name: "Spring Boot 백엔드 개발",
          one_liner: "Java Spring Boot로 백엔드 서버를 만들어보는 스터디",
        },
        status: 1,
        intro: "백엔드 개발을 처음부터 배우고 싶습니다.",
      },
      secondary_application: null,
    },
  ],
};

export default async function MyPage() {
  // const session = await auth();
  // if (!session?.accessToken) {
  //   redirect("/signin");
  // }

  const profile = MOCK_PROFILE;
  const studiesData = MOCK_STUDIES;
  const applicationsData = MOCK_APPLICATIONS;

  return (
    <MyPageClient
      profile={profile}
      studiesData={studiesData}
      applicationsData={applicationsData}
    />
  );
}
