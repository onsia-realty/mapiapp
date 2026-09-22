"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SecondaryMarker {
  latitude: number;
  longitude: number;
  title: string;
  type?: "bus" | "subway" | "school" | "default";
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string;
  level?: number;
  className?: string;
  secondaryMarker?: SecondaryMarker | null;
  onSecondaryMarkerClick?: () => void;
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
  secondaryMarker = null,
  onSecondaryMarkerClick,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const secondaryMarkerRef = useRef<any>(null);
  const secondaryInfowindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 보조 마커 업데이트 함수
  const updateSecondaryMarker = useCallback(() => {
    if (!mapInstanceRef.current || !window.kakao) return;

    // 기존 보조 마커 제거
    if (secondaryMarkerRef.current) {
      secondaryMarkerRef.current.setMap(null);
      secondaryMarkerRef.current = null;
    }
    if (secondaryInfowindowRef.current) {
      secondaryInfowindowRef.current.close();
      secondaryInfowindowRef.current = null;
    }

    // 새 보조 마커 추가
    if (secondaryMarker) {
      const position = new window.kakao.maps.LatLng(
        secondaryMarker.latitude,
        secondaryMarker.longitude
      );

      // 마커 이미지 설정 (버스: 녹색)
      let markerImage;
      if (secondaryMarker.type === "bus") {
        const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
        const imageSize = new window.kakao.maps.Size(24, 35);
        markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
      }

      const marker = new window.kakao.maps.Marker({
        position: position,
        title: secondaryMarker.title,
        image: markerImage,
      });
      marker.setMap(mapInstanceRef.current);
      secondaryMarkerRef.current = marker;

      // 인포윈도우
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px 10px;font-size:12px;white-space:nowrap;background:#22c55e;color:white;border-radius:4px;">🚌 ${secondaryMarker.title}</div>`,
      });
      infowindow.open(mapInstanceRef.current, marker);
      secondaryInfowindowRef.current = infowindow;

      // 지도 중심 이동 (부드럽게)
      mapInstanceRef.current.panTo(position);
    }
  }, [secondaryMarker]);

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
        mapInstanceRef.current = map;

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

        // 초기 보조 마커 설정
        if (secondaryMarker) {
          updateSecondaryMarker();
        }
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

  // 보조 마커 변경 시 업데이트
  useEffect(() => {
    if (!isLoading && mapInstanceRef.current) {
      updateSecondaryMarker();
    }
  }, [secondaryMarker, isLoading, updateSecondaryMarker]);

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
