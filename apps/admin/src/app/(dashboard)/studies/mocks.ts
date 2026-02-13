import { fakerKO } from "@faker-js/faker";
import { SemesterInfo, Study } from "./types";

const MOCK_CURRENT_SEMESTER: SemesterInfo = {
  year: 2025,
  semester: 2,
};

export async function getCurrentSemester(): Promise<SemesterInfo> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_CURRENT_SEMESTER;
}

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

/**
 * Generate mock studies with API-compatible structure
 */
function generateMockStudies(count: number, startId: number): Study[] {
  return Array.from({ length: count }).map((_, i) => {
    const tag = fakerKO.helpers.arrayElement(TAGS);
    const tags = [tag];

    // Randomly add more tags
    if (fakerKO.datatype.boolean()) {
      const secondTag = fakerKO.helpers.arrayElement(
        TAGS.filter((t) => t !== tag),
      );
      tags.push(secondTag);
    }

    return {
      id: startId + i,
      study_name: `FORIF ${tag} 스터디 ${fakerKO.number.int({ min: 1, max: 5 })}`,
      primary_mentor_name: fakerKO.person.fullName(),
      secondary_mentor_name: fakerKO.datatype.boolean()
        ? fakerKO.person.fullName()
        : null,
      tags: tags,
      one_liner: fakerKO.lorem.sentence(50),
      mentee_count: fakerKO.number.int({ min: 0, max: 30 }),
      recruit_status: fakerKO.helpers.arrayElement(["APPLICABLE", "CLOSED"]) as
        | "APPLICABLE"
        | "CLOSED",
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

/**
 * Get mock studies by semester label
 * Used when USE_MOCK_DATA=true
 */
export async function getMockStudiesBySemester(
  semesterLabel: string,
): Promise<Study[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (semesterLabel === "전체") {
    return Object.values(MOCK_STUDIES_BY_SEMESTER).flat();
  }

  return MOCK_STUDIES_BY_SEMESTER[semesterLabel] || [];
}
