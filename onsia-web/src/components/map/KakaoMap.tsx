"use client";

import { useEffect, useRef, useState } from "react";

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
  level?: number;
  className?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function KakaoMap({
  latitude,
  longitude,
  markerTitle = "위치",
  level = 3,
  className = "",
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      try {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: level,
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          title: markerTitle,
        });
        marker.setMap(map);

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px 10px;font-size:12px;white-space:nowrap;">${markerTitle}</div>`,
        });
        infowindow.open(map, marker);

        setIsLoading(false);
      } catch (err) {
        console.error("카카오맵 초기화 에러:", err);
        setError("지도를 불러올 수 없습니다.");
        setIsLoading(false);
      }
    };

    // 카카오맵 SDK 로드 대기
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initMap);
      } else {
        setTimeout(checkKakaoMaps, 100);
      }
    };

    checkKakaoMaps();
  }, [latitude, longitude, markerTitle, level]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
          <p className="text-sm text-gray-500">지도 로딩중...</p>
        </div>
      )}
      <div ref={mapRef} className={className} style={{ minHeight: "300px" }} />
    </div>
  );
}
