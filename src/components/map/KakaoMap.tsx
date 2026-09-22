"use client";

import { PropertyMap, PropertyMapPoint } from "@/components/map/PropertyMap";

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

export function KakaoMap({
  latitude,
  longitude,
  markerTitle = "위치",
  className = "",
  secondaryMarker = null,
  onSecondaryMarkerClick,
}: KakaoMapProps) {
  const points: PropertyMapPoint[] = [
    { id: "primary", latitude, longitude, title: markerTitle, price: markerTitle, tone: "purple" },
  ];

  if (secondaryMarker) {
    points.push({
      id: "secondary",
      latitude: secondaryMarker.latitude,
      longitude: secondaryMarker.longitude,
      title: secondaryMarker.title,
      price: secondaryMarker.title,
      tone: secondaryMarker.type === "bus" ? "green" : "blue",
    });
  }

  return (
    <PropertyMap
      latitude={latitude}
      longitude={longitude}
      points={points}
      selectedId={secondaryMarker ? "secondary" : "primary"}
      className={className}
      onSelect={(id) => {
        if (id === "secondary") onSecondaryMarkerClick?.();
      }}
    />
  );
}
