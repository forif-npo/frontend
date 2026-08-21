export const STUDY_LOCATION_MAP = {
  동아리방: {
    label: "동아리방",
    placeName: "한양대학교 FORIF 동아리방",
    latitude: 37.5551,
    longitude: 127.0475,
  },
  "IT/BT관": {
    label: "IT/BT관",
    placeName: "한양대학교 서울캠퍼스 IT/BT관",
    latitude: 37.5561,
    longitude: 127.0498,
  },
  FTC: {
    label: "FTC",
    placeName: "한양대학교 서울캠퍼스 FTC",
    latitude: 37.5548,
    longitude: 127.0472,
  },
  신소재공학관: {
    label: "신소재공학관",
    placeName: "한양대학교 서울캠퍼스 신소재공학관",
    latitude: 37.5547,
    longitude: 127.0453,
  },
  제1공학관: {
    label: "제1공학관",
    placeName: "한양대학교 서울캠퍼스 제1공학관",
    latitude: 37.5568,
    longitude: 127.0457,
  },
} as const;

export const LOCATION_OPTIONS = [
  { value: "장소 미정", label: "장소 미정" },
  ...Object.entries(STUDY_LOCATION_MAP).map(([value, location]) => ({
    value,
    label: location.label,
  })),
  { value: "온라인", label: "온라인" },
] as const;

export function getStudyLocationMap(location: string | null | undefined) {
  if (!location) return null;

  return (
    STUDY_LOCATION_MAP[location as keyof typeof STUDY_LOCATION_MAP] ?? null
  );
}
