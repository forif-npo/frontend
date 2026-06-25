import { KakaoMap } from "@/components/KakaoMap";
import { Body, Heading } from "@ui/components/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "찾아오시는 길",
  description: "FORIF 동아리방 위치 및 찾아오시는 길 안내입니다.",
};

const PLACE_NAME = "한양대학교 FORIF 동아리방";
const ADDRESS =
  "(04763) 서울 성동구 왕십리로 222 한양대학교 대운동장 지하2층 B214호";

// 지도 중심 좌표 (위도, 경도). 카카오맵에서 정확한 위치 좌표를 확인해 수정하세요.
const LAT = 37.5551;
const LNG = 127.0475;

const INFO_ITEMS = [
  { label: "주소", value: ADDRESS },
  { label: "이메일", value: "contact@forif.org" },
  { label: "회장 연락처", value: "010-3981-2273" },
];

export default function DirectionsPage() {
  return (
    <main className="mx-auto w-full max-w-[800px] px-5 py-12 sm:px-6 lg:px-0 lg:py-16">
      <Heading size="l" className="text-text-basic mb-2">
        찾아오시는 길
      </Heading>
      <Body size="m" className="text-text-subtle mb-8">
        한양대학교 서울캠퍼스 대운동장 지하에 FORIF 동아리방이 있습니다.
      </Body>

      <KakaoMap
        placeName={PLACE_NAME}
        lat={LAT}
        lng={LNG}
        className="h-[260px] w-full rounded-[12px] md:h-[360px]"
      />

      <dl className="mt-8 flex flex-col gap-4">
        {INFO_ITEMS.map((item) => (
          <div
            key={item.label}
            className="border-divider-gray-light flex flex-col gap-1 border-b pb-4 sm:flex-row sm:gap-4"
          >
            <dt className="w-[96px] shrink-0">
              <Body size="m" weight="bold" className="text-text-basic">
                {item.label}
              </Body>
            </dt>
            <dd className="min-w-0">
              <Body size="m" className="text-text-subtle break-keep">
                {item.value}
              </Body>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
