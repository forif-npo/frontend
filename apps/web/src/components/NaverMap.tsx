"use client";

import { useEffect, useRef } from "react";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    naver: any;
  }
}

interface NaverMapProps {
  location: string;
  className?: string;
}

// 한양대학교 서울캠퍼스 기본 좌표
const DEFAULT_LAT = 37.5573;
const DEFAULT_LNG = 127.0007;

export function NaverMap({ location, className }: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    const initMap = () => {
      if (!mapRef.current || !window.naver) return;

      const center = new window.naver.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG);

      const map = new window.naver.maps.Map(mapRef.current, {
        center,
        zoom: 17,
        zoomControl: false,
        mapTypeControl: false,
      });

      new window.naver.maps.Marker({
        position: center,
        map,
        title: location,
      });

      mapInstanceRef.current = map;
    };

    if (window.naver?.maps) {
      initMap();
      return;
    }

    const scriptId = "naver-map-script";
    if (document.getElementById(scriptId)) {
      const checkInterval = setInterval(() => {
        if (window.naver?.maps) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  }, [location]);

  return (
    <div
      ref={mapRef}
      className={className ?? "h-[200px] w-full rounded-[8px] md:h-[300px]"}
    />
  );
}
