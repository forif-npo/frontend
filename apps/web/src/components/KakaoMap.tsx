"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

interface KakaoMapProps {
  /** 마커에 표시할 장소명 */
  placeName: string;
  /** 지도 중심 위도 */
  lat?: number;
  /** 지도 중심 경도 */
  lng?: number;
  level?: number;
  className?: string;
}

// 한양대학교 서울캠퍼스 기본 좌표
const DEFAULT_LAT = 37.5551;
const DEFAULT_LNG = 127.0475;

export function KakaoMap({
  placeName,
  lat = DEFAULT_LAT,
  lng = DEFAULT_LNG,
  level = 3,
  className,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  useEffect(() => {
    if (!appKey) return;

    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      const center = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level,
      });

      const marker = new window.kakao.maps.Marker({ position: center });
      marker.setMap(map);

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:13px;white-space:nowrap;">${placeName}</div>`,
      });
      infoWindow.open(map, marker);
    };

    const loadSdk = () => window.kakao.maps.load(initMap);

    if (window.kakao?.maps) {
      loadSdk();
      return;
    }

    const scriptId = "kakao-map-script";
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.addEventListener("load", loadSdk);
      return () => existing.removeEventListener("load", loadSdk);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = loadSdk;
    document.head.appendChild(script);
  }, [appKey, lat, lng, level, placeName]);

  // 앱키가 없으면 카카오맵 웹으로 연결되는 폴백을 보여준다.
  if (!appKey) {
    return (
      <a
        href={`https://map.kakao.com/?q=${encodeURIComponent(placeName)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={
          className ??
          "bg-surface-gray-subtler text-text-subtle flex h-[260px] w-full items-center justify-center rounded-[8px] text-sm md:h-[360px]"
        }
      >
        카카오맵에서 위치 보기 →
      </a>
    );
  }

  return (
    <div
      ref={mapRef}
      className={className ?? "h-[260px] w-full rounded-[8px] md:h-[360px]"}
    />
  );
}
