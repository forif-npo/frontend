// import { delay, http, HttpResponse } from "msw";
// import { getCurrentSemester } from "@/constants/study";
// import type { Study, RecruitStatus } from "@/types/study";

// const generateMockStudies = (count: number): Study[] => {
//   const studies: Study[] = [];
//   const TAG_OPTIONS = [
//     "데이터베이스",
//     "프로그래밍 기초",
//     "프론트엔드",
//     "백엔드",
//     "풀스택",
//     "앱",
//     "인공지능",
//     "데이터",
//     "보안",
//     "게임",
//     "디자인",
//     "알고리즘",
//     "블록체인",
//   ];

//   const difficulties: string[] = [
//     "EASY",
//     "SEMI_EASY",
//     "NORMAL",
//     "SEMI_HARD",
//     "HARD",
//   ];
//   const recruitStatuses: RecruitStatus[] = ["APPLICABLE", "CLOSED"];
//   const weekDays = [0, 1, 2, 3, 4, 5, 6] as const;
//   const primaryMentors = [
//     "표준성",
//     "양병현",
//     "김철수",
//     "이영희",
//     "박민수",
//     "최지훈",
//     "정수진",
//   ];
//   const secondaryMentors = [
//     "이준호",
//     "강서연",
//     "윤하늘",
//     null,
//     null,
//     "박지원",
//     null,
//   ];
//   const studyNames = [
//     "이 파이썬 스터디 듣고 개발자되면 책임 못 짐",
//     "React 마스터 클래스",
//     "알고리즘 문제 해결 전략",
//     "HTML/CSS 입문",
//     "iOS 앱 개발",
//     "데이터베이스 설계와 SQL",
//     "창컴, 공창컴.. 너 뭐 돼? 내가 파이썬을 안다고? No. 파이썬이 나를 안다고 해라.",
//     "AI/ML 기초부터 실전까지",
//   ];
//   const oneLiners = [
//     "창컴, 공창컴.. 너 뭐 돼? 내가 파이썬을 안다고? No. 파이썬이 나를 안다고 해라.",
//     "React의 모든 것을 배우는 실전 프로젝트 스터디",
//     "코딩테스트 합격을 위한 알고리즘 정복",
//     "웹 개발의 기초, HTML과 CSS 마스터하기",
//     "Swift로 만드는 나만의 iOS 앱",
//     "데이터베이스의 모든 것",
//   ];
//   const current = getCurrentSemester();

//   for (let i = 1; i <= count; i++) {
//     const tagIndices = [i % TAG_OPTIONS.length, (i + 1) % TAG_OPTIONS.length];
//     studies.push({
//       id: i,
//       study_name: studyNames[i % studyNames.length],
//       primary_mentor_name: primaryMentors[i % primaryMentors.length],
//       secondary_mentor_name: secondaryMentors[i % secondaryMentors.length],
//       tags: tagIndices.map((idx) => TAG_OPTIONS[idx]),
//       recruit_status: recruitStatuses[i % recruitStatuses.length],
//       one_liner: oneLiners[i % oneLiners.length],
//       explanation: `이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다. 이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다.이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다.이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다.이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다.이 스터디는 ${studyNames[i % studyNames.length]}를 다루는 종합 과정입니다. 기초부터 실전 프로젝트까지 체계적으로 학습합니다.`,
//       start_time: i % 2 === 0 ? "17:00" : "19:00",
//       end_time: i % 2 === 0 ? "18:30" : "21:00",
//       week_day: weekDays[i % weekDays.length],
//       location: i % 3 === 0 ? "공학관 301호" : "학생회관 세미나실",
//       difficulty: difficulties[i % difficulties.length],
//       img_url: `/temp_python.png`,
//       act_year: current.year,
//       act_semester: current.semester,
//     });
//   }
//   return studies;
// };

// const mockStudies = generateMockStudies(50);

// // GET /api/v1/studies - 스터디 목록 조회
// export const getStudies = http.get(
//   "https://api.forif.org/api/v1/studies",
//   async ({ request }) => {
//     await delay(500);

//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page") || "0");
//     const pageSize = parseInt(url.searchParams.get("page_size") || "20");
//     const year = url.searchParams.get("year");
//     const semester = url.searchParams.get("semester");
//     const difficulties = url.searchParams.getAll("difficulties");
//     const tags = url.searchParams.getAll("tags");
//     const recruitStatus = url.searchParams.get("recruit_status");
//     const search = url.searchParams.get("search");

//     let filtered = [...mockStudies];

//     // Apply filters
//     if (year) {
//       filtered = filtered.filter((s) => s.act_year === parseInt(year));
//     }
//     if (semester) {
//       filtered = filtered.filter((s) => s.act_semester === parseInt(semester));
//     }
//     if (difficulties.length > 0) {
//       filtered = filtered.filter((s) => difficulties.includes(s.difficulty));
//     }
//     if (tags.length > 0) {
//       filtered = filtered.filter((s) =>
//         s.tags.some((tag) => tags.includes(tag)),
//       );
//     }
//     if (recruitStatus) {
//       filtered = filtered.filter((s) => s.recruit_status === recruitStatus);
//     }
//     if (search) {
//       const searchLower = search.toLowerCase();
//       filtered = filtered.filter(
//         (s) =>
//           s.study_name.toLowerCase().includes(searchLower) ||
//           s.primary_mentor_name.toLowerCase().includes(searchLower) ||
//           (s.secondary_mentor_name &&
//             s.secondary_mentor_name.toLowerCase().includes(searchLower)),
//       );
//     }

//     // Apply pagination
//     const start = page * pageSize;
//     const end = start + pageSize;
//     const paginatedStudies = filtered.slice(start, end);

//     return HttpResponse.json({
//       timestamp: Date.now(),
//       data: paginatedStudies,
//       errorCode: null,
//       message: "Success",
//     });
//   },
// );

// // GET /api/v1/studies/:id - 스터디 상세 조회
// export const getStudyDetail = http.get(
//   "https://api.forif.org/api/v1/studies/:id",
//   async ({ params }) => {
//     await delay(500);
//     const { id } = params;
//     const study = mockStudies.find((s) => s.id === parseInt(id as string));

//     if (!study) {
//       return HttpResponse.json(
//         {
//           timestamp: Date.now(),
//           data: null,
//           errorCode: "FOR018-404",
//           message: "스터디를 찾을 수 없습니다.",
//         },
//         { status: 404 },
//       );
//     }

//     return HttpResponse.json({
//       timestamp: Date.now(),
//       data: study,
//       errorCode: null,
//       message: "Success",
//     });
//   },
// );

// // POST /api/v1/study/apply - 스터디 신청
// export const applyStudy = http.post(
//   "https://api.forif.org/api/v1/study/apply",
//   async ({ request }) => {
//     await delay(800);

//     const body = (await request.json()) as {
//       primaryStudyId: number;
//       primaryStudyApplyReason: string;
//       secondaryStudyId?: number;
//       secondaryStudyApplyReason?: string;
//     };

//     // Validate primary study exists
//     const primaryStudy = mockStudies.find((s) => s.id === body.primaryStudyId);
//     if (!primaryStudy) {
//       return HttpResponse.json(
//         {
//           message: "스터디가 존재하지 않습니다.",
//           errorCode: "FOR018-404",
//         },
//         { status: 404 },
//       );
//     }

//     // Validate secondary study if provided
//     if (body.secondaryStudyId) {
//       const secondaryStudy = mockStudies.find(
//         (s) => s.id === body.secondaryStudyId,
//       );
//       if (!secondaryStudy) {
//         return HttpResponse.json(
//           {
//             message: "스터디가 존재하지 않습니다.",
//             errorCode: "FOR018-404",
//           },
//           { status: 404 },
//         );
//       }
//     }

//     // Simulate already applied scenario (10% chance)
//     if (Math.random() < 0.1) {
//       return HttpResponse.json(
//         {
//           message: "이번학기 스터디에 이미 지원 했습니다.",
//           errorCode: "FOR032-409",
//         },
//         { status: 409 },
//       );
//     }

//     // Success response
//     return HttpResponse.json({
//       message: "Success",
//       data: null,
//     });
//   },
// );
