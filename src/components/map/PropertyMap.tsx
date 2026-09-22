"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    // Kakao Maps SDK is loaded at runtime and does not ship project-local types.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export interface PropertyMapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  subtitle?: string;
  price?: string;
  tone?: "purple" | "orange" | "blue" | "gold" | "green";
}

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  points: PropertyMapPoint[];
  selectedId?: string | null;
  className?: string;
  onSelect?: (id: string) => void;
}

const TONES = {
  purple: { background: "#7B2FF7", color: "#fff" },
  orange: { background: "#F97316", color: "#fff" },
  blue: { background: "#2563EB", color: "#fff" },
  gold: { background: "#D7AE54", color: "#3A2C10" },
  green: { background: "#16A34A", color: "#fff" },
};

function hasUsableKakaoKey() {
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  return Boolean(key && !key.toLowerCase().includes("your_") && key !== "undefined");
}

function fallbackPosition(point: PropertyMapPoint, points: PropertyMapPoint[]) {
  const latitudes = points.map((item) => item.latitude);
  const longitudes = points.map((item) => item.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latRange = Math.max(maxLat - minLat, 0.02);
  const lngRange = Math.max(maxLng - minLng, 0.02);

  return {
    left: `${12 + ((point.longitude - minLng) / lngRange) * 76}%`,
    top: `${14 + ((maxLat - point.latitude) / latRange) * 68}%`,
  };
}

function DemoMap({ points, selectedId, onSelect }: Pick<PropertyMapProps, "points" | "selectedId" | "onSelect">) {
  const safePoints = points.length > 0 ? points : [{ id: "center", latitude: 37.5035, longitude: 127.03, title: "서울", tone: "purple" as const }];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#edf0e9]">
      <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 430 760" preserveAspectRatio="none">
        <rect width="430" height="760" fill="#edf0e9" />
        <path d="M-30 120 C90 170 120 80 240 140 S380 230 470 160" fill="none" stroke="#fff" strokeWidth="34" />
        <path d="M-30 120 C90 170 120 80 240 140 S380 230 470 160" fill="none" stroke="#d6d2c4" strokeWidth="2" />
        <path d="M40 -30 C90 130 40 260 130 390 S250 600 210 800" fill="none" stroke="#fff" strokeWidth="28" />
        <path d="M40 -30 C90 130 40 260 130 390 S250 600 210 800" fill="none" stroke="#ded9ca" strokeWidth="2" />
        <path d="M320 -20 C290 150 390 270 315 450 S270 650 350 800" fill="none" stroke="#fff" strokeWidth="24" />
        <path d="M320 -20 C290 150 390 270 315 450 S270 650 350 800" fill="none" stroke="#ded9ca" strokeWidth="2" />
        <path d="M-20 560 C120 500 250 590 460 520" fill="none" stroke="#cae2f1" strokeWidth="66" opacity=".85" />
        <path d="M-20 560 C120 500 250 590 460 520" fill="none" stroke="#9dc9e1" strokeWidth="2" />
        <g fill="#dbe7d3">
          <rect x="145" y="210" width="82" height="100" rx="15" />
          <rect x="270" y="330" width="105" height="84" rx="18" />
          <rect x="25" y="620" width="92" height="72" rx="15" />
        </g>
        <g fill="#7c8579" fontSize="12" fontWeight="700">
          <text x="155" y="260">도심공원</text>
          <text x="280" y="375">업무지구</text>
          <text x="28" y="665">생활권역</text>
          <text x="245" y="545" fill="#4d87a8">한강</text>
        </g>
      </svg>

      <div className="absolute bottom-3 left-3 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[10px] font-bold text-[#5e6570] shadow-sm backdrop-blur">
        데모 지도 · 카카오맵 API 연결 가능
      </div>

      {safePoints.map((point) => {
        const position = fallbackPosition(point, safePoints);
        const selected = point.id === selectedId;
        const tone = TONES[point.tone ?? "purple"];
        return (
          <button
            key={point.id}
            type="button"
            onClick={() => onSelect?.(point.id)}
            className={cn("absolute z-10 -translate-x-1/2 -translate-y-full transition-transform", selected && "z-20 scale-110")}
            style={position}
            aria-label={`${point.title}${point.price ? ` ${point.price}` : ""}`}
          >
            <span className="block max-w-[118px] truncate rounded-[10px] border-2 border-white px-2.5 py-1.5 text-[11px] font-black shadow-[0_5px_16px_rgba(27,23,38,.24)]" style={tone}>
              {point.price ?? point.title}
            </span>
            <span className="mx-auto block h-0 w-0 border-x-[6px] border-t-[8px] border-x-transparent" style={{ borderTopColor: tone.background }} />
          </button>
        );
      })}
    </div>
  );
}

export function PropertyMap({ latitude, longitude, points, selectedId, className, onSelect }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const kakaoAvailable = hasUsableKakaoKey();
  const [mode, setMode] = useState<"loading" | "kakao" | "demo">(kakaoAvailable ? "loading" : "demo");
  const stablePoints = useMemo(() => points, [points]);

  useEffect(() => {
    if (!kakaoAvailable) return;

    let cancelled = false;
    let attempts = 0;
    const overlays: Array<{ setMap: (map: null) => void }> = [];

    const initialize = () => {
      if (cancelled || !mapRef.current) return;
      if (!window.kakao?.maps) {
        attempts += 1;
        if (attempts >= 40) {
          setMode("demo");
          return;
        }
        window.setTimeout(initialize, 100);
        return;
      }

      window.kakao.maps.load(() => {
        if (cancelled || !mapRef.current) return;
        const center = new window.kakao.maps.LatLng(latitude, longitude);
        const map = new window.kakao.maps.Map(mapRef.current, { center, level: 6 });

        stablePoints.forEach((point) => {
          const position = new window.kakao.maps.LatLng(point.latitude, point.longitude);
          const button = document.createElement("button");
          const tone = TONES[point.tone ?? "purple"];
          button.type = "button";
          button.textContent = point.price ?? point.title;
          button.title = point.title;
          button.style.cssText = `border:2px solid white;border-radius:10px;padding:6px 10px;background:${tone.background};color:${tone.color};font:800 12px Pretendard,sans-serif;box-shadow:0 5px 16px rgba(27,23,38,.24);white-space:nowrap;cursor:pointer;transform:${point.id === selectedId ? "scale(1.12)" : "scale(1)"};`;
          button.addEventListener("click", () => onSelect?.(point.id));
          const overlay = new window.kakao.maps.CustomOverlay({ position, content: button, yAnchor: 1.2 });
          overlay.setMap(map);
          overlays.push(overlay);
        });

        setMode("kakao");
      });
    };

    initialize();
    return () => {
      cancelled = true;
      overlays.forEach((overlay) => overlay.setMap(null));
    };
  }, [kakaoAvailable, latitude, longitude, stablePoints, selectedId, onSelect]);

  return (
    <div className={cn("relative min-h-[300px] overflow-hidden bg-[#edf0e9]", className)}>
      <div ref={mapRef} className="absolute inset-0" />
      {mode !== "kakao" && <DemoMap points={points} selectedId={selectedId} onSelect={onSelect} />}
      {mode === "loading" && (
        <div className="absolute inset-x-0 top-3 z-30 mx-auto flex w-max items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold text-[#6f6877] shadow-sm">
          <MapPin className="h-3.5 w-3.5 text-[var(--brand-purple)]" /> 카카오 지도 연결 중
        </div>
      )}
      {mode === "demo" && points.length === 0 && (
        <div className="absolute inset-0 z-20 grid place-items-center">
          <div className="rounded-2xl bg-white/92 px-5 py-4 text-center shadow-lg backdrop-blur">
            <Building2 className="mx-auto h-6 w-6 text-[var(--brand-purple)]" />
            <p className="mt-2 text-xs font-black text-[var(--brand-ink)]">표시할 위치가 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
