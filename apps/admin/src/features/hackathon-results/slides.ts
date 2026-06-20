import { TRACK_ORDER } from "./types";
import type { AwardResult, HackathonResultDraft, ResultTrack } from "./types";

export type PresentationSlide =
  | { type: "COVER"; title: string }
  | { type: "TRACK_INTRO"; track: ResultTrack }
  | { type: "AWARD"; result: AwardResult }
  | { type: "FINALE"; results: AwardResult[] };

/** 팀명이 있는 행만 발표 대상으로 본다. */
export function isPresentable(result: AwardResult): boolean {
  return result.teamName.trim().length > 0;
}

const isSpecial = (result: AwardResult): boolean => result.rank === null;

/**
 * 발표 공개 순서:
 * 1. 특별상(순위 없음)을 먼저 공개한다.
 * 2. 순위상은 큰 숫자 → 작은 숫자 순서로 공개한다. (3위, 2위, 1위)
 * 3. 동률이거나 특별상끼리는 입력 순서(presentationOrder)를 유지한다.
 */
function sortForReveal(results: AwardResult[]): AwardResult[] {
  return [...results].sort((a, b) => {
    if (isSpecial(a) !== isSpecial(b)) return isSpecial(a) ? -1 : 1;
    if (!isSpecial(a) && !isSpecial(b) && a.rank !== b.rank) {
      return (b.rank as number) - (a.rank as number);
    }
    return a.presentationOrder - b.presentationOrder;
  });
}

/** 피날레 요약: 부문 순서대로, 순위상은 1위부터, 특별상은 마지막. */
function sortForFinale(results: AwardResult[]): AwardResult[] {
  return [...results].sort((a, b) => {
    const trackDiff =
      TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track);
    if (trackDiff !== 0) return trackDiff;
    if (isSpecial(a) !== isSpecial(b)) return isSpecial(a) ? 1 : -1;
    if (!isSpecial(a) && !isSpecial(b) && a.rank !== b.rank) {
      return (a.rank as number) - (b.rank as number);
    }
    return a.presentationOrder - b.presentationOrder;
  });
}

/**
 * 저장 데이터에서 발표 슬라이드를 생성하는 순수 함수.
 * 빈 부문은 intro와 award 슬라이드를 만들지 않는다.
 */
export function generateSlides(
  draft: HackathonResultDraft,
): PresentationSlide[] {
  const slides: PresentationSlide[] = [];
  slides.push({ type: "COVER", title: draft.eventTitle });

  const presentable = draft.results.filter(isPresentable);

  for (const track of TRACK_ORDER) {
    const inTrack = presentable.filter((r) => r.track === track);
    if (inTrack.length === 0) continue;
    slides.push({ type: "TRACK_INTRO", track });
    for (const result of sortForReveal(inTrack)) {
      slides.push({ type: "AWARD", result });
    }
  }

  if (presentable.length > 0) {
    slides.push({ type: "FINALE", results: sortForFinale(presentable) });
  }

  return slides;
}
