"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft, MapPin, Building2, ExternalLink } from "lucide-react";
import type { KnowledgeCenterData } from "@/types/api";

export default function KnowledgeCenterDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [center, setCenter] = useState<KnowledgeCenterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCenter() {
      try {
        const response = await fetch(`/api/knowledge-centers/${id}`);
        const result = await response.json();
        if (result.success) {
          setCenter(result.data);
        } else {
          setError(result.error || "조회 실패");
        }
      } catch (e) {
        setError("네트워크 오류");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCenter();
  }, [id]);

  if (loading) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        </div>
      </MobileLayout>
    );
  }

  if (error || !center) {
    return (
      <MobileLayout>
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4">
            <Link href="/category/bunyanggwon">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">지식산업센터</h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-sm">
            {error || "정보를 찾을 수 없습니다."}
          </p>
        </div>
      </MobileLayout>
    );
  }

  const address = center.roadAddress || center.jibunAddress;
  const naverMapUrl = `https://map.naver.com/p/search/${encodeURIComponent(
    `${center.centerName} ${address}`
  )}`;
  const naverSearchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(
    `${center.centerName} 분양`
  )}`;

  return (
    <MobileLayout>
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/category/bunyanggwon">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
            {center.centerName}
          </h1>
        </div>
      </header>

      {/* 헤더 정보 */}
      <div className="px-5 pt-4">
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-1 rounded font-medium">
            {center.saleType}
          </span>
          <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {center.buildStatus || "상태 미지정"}
          </span>
          {center.complexType && (
            <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {center.complexType}
            </span>
          )}
          {center.installer && (
            <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded">
              {center.installer}
            </span>
          )}
        </div>

        <div className="flex items-start gap-2 mb-1">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700">{address}</p>
        </div>
        {center.jibunAddress && center.roadAddress && (
          <p className="text-xs text-gray-500 ml-6">
            지번: {center.jibunAddress}
          </p>
        )}
      </div>

      {/* 출처 안내 */}
      <div className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <p className="text-xs text-amber-800">
          📊 한국산업단지공단 공공데이터 (2025-06-30 기준) — 단지 마스터 정보.
          분양가·일정·세대수 등은 공식 분양사이트 참조.
        </p>
      </div>

      {/* 단지 기본 정보 */}
      <div className="px-5 pt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4" /> 단지 정보
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              <Row label="시도" value={center.sido} />
              <Row label="시군구" value={center.sigungu} />
              <Row label="단지명" value={center.complexName} />
              <Row label="입지구분" value={center.position} />
              <Row label="등록구분" value={center.registration} />
              <Row label="관할기관" value={center.jurisdiction} />
              <Row label="설치자" value={center.installer} />
              <Row label="현재 상태" value={center.status} />
              <Row label="지목" value={center.landUse} />
              <Row label="용도지역" value={[center.zoning1, center.zoning2].filter(Boolean).join(" / ")} />
            </tbody>
          </table>
        </div>
      </div>

      {/* 면적 정보 */}
      <div className="px-5 pt-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">면적</h2>
        <div className="grid grid-cols-2 gap-2">
          <Card label="용지면적" value={center.landArea} unit="㎡" />
          <Card label="건축면적" value={center.buildingArea} unit="㎡" />
          <Card label="제조면적" value={center.manufactureArea} unit="㎡" />
          <Card label="부대면적" value={center.ancillaryArea} unit="㎡" />
        </div>
      </div>

      {/* 시행/시공 */}
      {center.company && (
        <div className="px-5 pt-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">시행/시공</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-900">{center.company}</p>
          </div>
        </div>
      )}

      {/* 외부 링크 */}
      <div className="px-5 pt-6 pb-10 space-y-2">
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-900">네이버 지도에서 보기</span>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
        <a
          href={naverSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 active:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-900">분양 정보 검색 (분양가/일정)</span>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>
    </MobileLayout>
  );
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null;
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-3 py-2.5 text-gray-600 bg-gray-50 w-24">{label}</td>
      <td className="px-3 py-2.5 text-gray-900">{value}</td>
    </tr>
  );
}

function Card({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-sm font-bold text-gray-900">
        {value > 0 ? `${Math.round(value).toLocaleString()}${unit}` : "-"}
      </div>
    </div>
  );
}
