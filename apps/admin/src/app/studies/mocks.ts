import { fakerKO } from "@faker-js/faker";
import { SemesterInfo, Study } from "./types";

export const MOCK_CURRENT_SEMESTER: SemesterInfo = {
  year: 2025,
  semester: 2,
};

const TAGS = [
  "Database",
  "Frontend",
  "Backend",
  "AI",
  "Mobile",
  "Security",
  "DevOps",
  "Algorithm",
];
const LOCATIONS = [
  "IT관 504호",
  "제2공학관 302호",
  "온라인 (Zoom)",
  "IT관 506호",
  "도서관 그룹스터디룸",
];
const TIMES = [
  { start: "18:00", end: "20:00" },
  { start: "19:00", end: "21:00" },
  { start: "20:00", end: "22:00" },
  { start: "10:00", end: "12:00" },
];

function generateMockStudies(count: number, startId: number): Study[] {
  return Array.from({ length: count }).map((_, i) => {
    const time = fakerKO.helpers.arrayElement(TIMES);
    const tag = fakerKO.helpers.arrayElement(TAGS);

    return {
      studyId: startId + i,
      studyName: `FORIF ${tag} 스터디 ${fakerKO.number.int({ min: 1, max: 5 })}`,
      primaryMentorName: fakerKO.person.fullName(),
      secondaryMentorName: fakerKO.datatype.boolean()
        ? fakerKO.person.fullName()
        : null,
      tag: tag,
      oneLiner: fakerKO.lorem.sentence(50),
      startTime: time.start,
      endTime: time.end,
      weekDay: fakerKO.number.int({ min: 1, max: 7 }), // 1=Mon, 7=Sun
      location: fakerKO.helpers.arrayElement(LOCATIONS),
      difficulty: fakerKO.number.int({ min: 1, max: 5 }),
      imgUrl: `https://dummyimage.com/600x400/000/fff&text=${tag}`,
    };
  });
}

// Mock database by semester label
// "25-2", "25-1", etc.
export const MOCK_STUDIES_BY_SEMESTER: Record<string, Study[]> = {
  "25-2": generateMockStudies(12, 100),
  "25-1": generateMockStudies(10, 200),
  "24-2": generateMockStudies(8, 300),
  "24-1": generateMockStudies(8, 400),
  "23-2": generateMockStudies(6, 500),
  "23-1": generateMockStudies(5, 600),
  "그 외": generateMockStudies(3, 900),
};

export async function getStudiesBySemester(
  semesterLabel: string,
): Promise<Study[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (semesterLabel === "전체") {
    return Object.values(MOCK_STUDIES_BY_SEMESTER).flat();
  }

  return MOCK_STUDIES_BY_SEMESTER[semesterLabel] || [];
}
