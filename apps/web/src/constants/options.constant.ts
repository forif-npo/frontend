export const departments = [
  "건축학부",
  "건축공학부",
  "도시공학과",
  "자원환경공학과",
  "교통물류공학과",
  "토목공학과",
  "융합전자공학부",
  "전자공학부",
  "컴퓨터소프트웨어학부",
  "정보시스템학과",
  "화학공학과",
  "신소재공학부",
  "에너지공학과",
  "기계공학부",
  "원자력공학과",
  "산업공학과",
  "미래자동차공학과",
  "생명공학과",
  "수학과",
  "물리학과",
  "화학과",
  "생명과학과",
  "정치외교학과",
  "행정학과",
  "사회학과",
  "미디어커뮤니케이션학과",
  "심리학과",
  "경영학부",
  "파이낸스경영학과",
  "경제금융학부",
  "국어국문학과",
  "중어중문학과",
  "영어영문학과",
  "독어독문학과",
  "사학과",
  "철학과",
  "교육학과",
  "국제학부",
  "스포츠산업학과",
  "의예과",
  "의학과",
  "간호학부",
  "융합인재학부",
  "실내건축디자인학과",
  "무용예술학과",
  "연극영화학과",
  "음악학부",
];

export const departmentsOptions = departments
  .map((department) => ({
    label: department,
    value: department,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const referralSources = ["지인 추천", "인스타그램", "동아리 박람회"];

export const referralSourcesOptions = referralSources
  .map((source) => ({
    label: source,
    value: source,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
