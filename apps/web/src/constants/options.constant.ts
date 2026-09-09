export const referralSources = ["지인 추천", "인스타그램", "동아리 박람회"];

export const referralSourcesOptions = referralSources
  .map((source) => ({
    label: source,
    value: source,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
