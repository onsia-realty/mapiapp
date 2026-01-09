"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  MessageCircle,
  Eye,
  Clock,
  Building2,
  Ruler,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn, formatPrice, formatArea, formatDate } from "@/lib/utils";
import { Property, BuildingLedger, CATEGORY_CONFIG } from "@/types";
import { Button } from "@/components/ui/button";

// 더미 매물 상세 데이터
const DUMMY_PROPERTIES: Record<string, Property & { buildingLedger?: BuildingLedger }> = {
  "1": {
    id: "1",
    category: "presale",
    title: "힐스테이트 강남 센트럴",
    address: "서울시 강남구 역삼동 123-45",
    price: 85000,
    dealType: "sale",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    description: "강남역 도보 5분 거리의 프리미엄 분양권입니다. 2025년 입주 예정이며, 남향 고층으로 조망권이 뛰어납니다. 분양가 대비 프리미엄이 적정 수준이며, 투자 가치가 높습니다.",
    exclusiveArea: 84.95,
    supplyArea: 112.5,
    floor: "15층/25층",
    rooms: 3,
    bathrooms: 2,
    direction: "남향",
    parking: "세대당 1.5대",
    moveInDate: "2025-06-01",
    latitude: 37.5012,
    longitude: 127.0396,
    brokerName: "온시아 공인중개사",
    brokerPhone: "010-1234-5678",
    brokerOffice: "서울시 강남구 역삼동 456-78",
    viewCount: 1523,
    likeCount: 89,
    isLiked: false,
    createdAt: "2024-01-15",
    buildingLedger: {
      landArea: "1,234.56㎡",
      buildingArea: "987.65㎡",
      totalFloorArea: "12,345.67㎡",
      buildingCoverage: "59.8%",
      floorAreaRatio: "299.5%",
      mainUse: "공동주택",
      structure: "철근콘크리트",
      approvalDate: "2023-12-15",
    },
  },
  "2": {
    id: "2",
    category: "apartment",
    title: "래미안 퍼스티지 301동",
    address: "서울시 서초구 반포동 789-12",
    price: 120000,
    dealType: "sale",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    ],
    description: "반포 한강변의 대표 아파트입니다. 한강 조망이 가능하며, 지하철 역세권입니다.",
    exclusiveArea: 114.5,
    supplyArea: 145.2,
    floor: "23층/35층",
    rooms: 4,
    bathrooms: 2,
    direction: "남서향",
    parking: "세대당 2대",
    latitude: 37.5045,
    longitude: 127.0108,
    brokerName: "반포 부동산",
    brokerPhone: "010-2345-6789",
    viewCount: 2341,
    likeCount: 156,
    isLiked: true,
    createdAt: "2024-01-10",
  },
  "3": {
    id: "3",
    category: "interestOnly",
    title: "이자만 투자형 오피스텔",
    address: "서울시 마포구 상암동 567-89",
    price: 35000,
    monthlyRent: 80,
    dealType: "monthly",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    description: "이자만 납부로 투자 가능한 수익형 오피스텔입니다. 월세 수익률 연 5% 이상 기대됩니다.",
    exclusiveArea: 28.5,
    supplyArea: 35.2,
    floor: "8층/15층",
    rooms: 1,
    bathrooms: 1,
    direction: "동향",
    parking: "세대당 0.5대",
    latitude: 37.5795,
    longitude: 126.8925,
    brokerName: "상암 부동산",
    brokerPhone: "010-3456-7890",
    viewCount: 892,
    likeCount: 45,
    isLiked: false,
    createdAt: "2024-01-18",
  },
};

// 거래유형 텍스트
const getDealTypeText = (dealType: string) => {
  switch (dealType) {
    case "sale": return "매매";
    case "rent": return "전세";
    case "monthly": return "월세";
    default: return "";
  }
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const property = DUMMY_PROPERTIES[id];

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">매물을 찾을 수 없습니다.</p>
          <Button onClick={() => router.back()} className="mt-4">
            뒤로 가기
          </Button>
        </div>
      </div>
    );
  }

  const categoryInfo = CATEGORY_CONFIG[property.category];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen">
        {/* 이미지 슬라이더 */}
        <div className="relative h-72">
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover"
          />

          {/* 상단 네비게이션 */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center"
              >
                <Heart
                  size={22}
                  className={cn(isLiked ? "fill-red-500 text-red-500" : "text-white")}
                />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <Share2 size={22} className="text-white" />
              </button>
            </div>
          </div>

          {/* 이미지 네비게이션 */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          {/* 이미지 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>

          {/* 카테고리 뱃지 */}
          <span className={cn("absolute bottom-4 left-4 px-3 py-1 text-sm font-semibold text-white rounded-full", categoryInfo.color)}>
            {categoryInfo.label}
          </span>
        </div>

        {/* 메인 정보 */}
        <div className="p-4">
          {/* 가격 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-sm font-medium text-blue-600 bg-blue-50 rounded">
              {getDealTypeText(property.dealType)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
            {property.monthlyRent && (
              <span className="text-lg"> / 월 {property.monthlyRent}만</span>
            )}
          </p>

          {/* 제목 & 주소 */}
          <h1 className="text-lg font-semibold text-gray-900 mt-3">{property.title}</h1>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin size={14} />
            <span className="text-sm">{property.address}</span>
          </div>

          {/* 조회수 & 등록일 */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              조회 {property.viewCount.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatDate(property.createdAt)}
            </span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-100" />

        {/* 상세 정보 */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">매물 정보</h2>
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon={Ruler} label="전용면적" value={formatArea(property.exclusiveArea)} />
            {property.supplyArea && (
              <InfoItem icon={Ruler} label="공급면적" value={formatArea(property.supplyArea)} />
            )}
            {property.floor && (
              <InfoItem icon={Building2} label="층수" value={property.floor} />
            )}
            {property.rooms && (
              <InfoItem icon={Building2} label="방/욕실" value={`${property.rooms}/${property.bathrooms}`} />
            )}
            {property.direction && (
              <InfoItem icon={Building2} label="방향" value={property.direction} />
            )}
            {property.parking && (
              <InfoItem icon={Building2} label="주차" value={property.parking} />
            )}
            {property.moveInDate && (
              <InfoItem icon={Calendar} label="입주예정" value={property.moveInDate} />
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-100" />

        {/* 설명 */}
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">상세 설명</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>

        {/* 건축물대장 (있는 경우만) */}
        {property.buildingLedger && (
          <>
            <div className="h-2 bg-gray-100" />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">건축물대장</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <LedgerRow label="대지면적" value={property.buildingLedger.landArea} />
                    <LedgerRow label="건축면적" value={property.buildingLedger.buildingArea} />
                    <LedgerRow label="연면적" value={property.buildingLedger.totalFloorArea} />
                    <LedgerRow label="건폐율" value={property.buildingLedger.buildingCoverage} />
                    <LedgerRow label="용적률" value={property.buildingLedger.floorAreaRatio} />
                    <LedgerRow label="주용도" value={property.buildingLedger.mainUse} />
                    <LedgerRow label="구조" value={property.buildingLedger.structure} />
                    <LedgerRow label="사용승인일" value={property.buildingLedger.approvalDate} isLast />
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* 구분선 */}
        <div className="h-2 bg-gray-100" />

        {/* 중개사 정보 */}
        <div className="p-4 mb-24">
          <h2 className="text-lg font-bold text-gray-900 mb-4">중개사 정보</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-900">{property.brokerName}</p>
            <p className="text-sm text-gray-500 mt-1">{property.brokerPhone}</p>
            {property.brokerOffice && (
              <p className="text-sm text-gray-500 mt-1">{property.brokerOffice}</p>
            )}
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <a
              href={`tel:${property.brokerPhone}`}
              className="flex-1 h-12 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold rounded-xl"
            >
              <Phone size={20} />
              전화하기
            </a>
            <button className="flex-1 h-12 flex items-center justify-center gap-2 bg-yellow-400 text-gray-900 font-semibold rounded-xl">
              <MessageCircle size={20} />
              문자하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 정보 아이템 컴포넌트
function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
        <Icon size={18} className="text-gray-500" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// 건축물대장 행 컴포넌트
function LedgerRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <tr className={cn(!isLast && "border-b border-gray-200")}>
      <td className="py-3 px-4 bg-gray-50 text-gray-600 font-medium w-28">{label}</td>
      <td className="py-3 px-4 text-gray-900">{value}</td>
    </tr>
  );
}
