"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Check,
  ChevronDown,
  Heart,
} from "lucide-react";
import { cn, formatPrice, formatArea } from "@/lib/utils";
import { Property, CATEGORY_CONFIG } from "@/types";
import { Button } from "@/components/ui/button";

// 더미 매물 데이터
const DUMMY_PROPERTIES: Property[] = [
  {
    id: "1",
    category: "presale",
    title: "힐스테이트 강남 센트럴",
    address: "서울시 강남구 역삼동",
    price: 85000,
    dealType: "sale",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"],
    description: "",
    exclusiveArea: 84.95,
    latitude: 37.5012,
    longitude: 127.0396,
    brokerName: "온시아 공인중개사",
    brokerPhone: "010-1234-5678",
    viewCount: 1523,
    likeCount: 89,
    isLiked: false,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    category: "apartment",
    title: "래미안 퍼스티지 301동",
    address: "서울시 서초구 반포동",
    price: 120000,
    dealType: "sale",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"],
    description: "",
    exclusiveArea: 114.5,
    latitude: 37.5045,
    longitude: 127.0108,
    brokerName: "반포 부동산",
    brokerPhone: "010-2345-6789",
    viewCount: 2341,
    likeCount: 156,
    isLiked: true,
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    category: "interestOnly",
    title: "이자만 투자형 오피스텔",
    address: "서울시 마포구 상암동",
    price: 35000,
    dealType: "monthly",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"],
    description: "",
    exclusiveArea: 28.5,
    latitude: 37.5795,
    longitude: 126.8925,
    brokerName: "상암 부동산",
    brokerPhone: "010-3456-7890",
    viewCount: 892,
    likeCount: 45,
    isLiked: false,
    createdAt: "2024-01-18",
  },
  {
    id: "4",
    category: "office",
    title: "강남 프라임 오피스",
    address: "서울시 강남구 테헤란로",
    price: 50000,
    dealType: "rent",
    images: ["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400"],
    description: "",
    exclusiveArea: 165.5,
    latitude: 37.5065,
    longitude: 127.0535,
    brokerName: "테헤란 부동산",
    brokerPhone: "010-4567-8901",
    viewCount: 567,
    likeCount: 23,
    isLiked: false,
    createdAt: "2024-01-20",
  },
];

// 필터 옵션
const DEAL_TYPES = [
  { value: "all", label: "전체" },
  { value: "sale", label: "매매" },
  { value: "rent", label: "전세" },
  { value: "monthly", label: "월세" },
];

const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "presale", label: "분양권전매" },
  { value: "interestOnly", label: "이자만" },
  { value: "profitable", label: "수익형부동산" },
  { value: "office", label: "사무실" },
  { value: "apartment", label: "아파트" },
];

const PRICE_RANGES = [
  { value: "all", label: "전체" },
  { value: "0-30000", label: "3억 이하" },
  { value: "30000-50000", label: "3억~5억" },
  { value: "50000-100000", label: "5억~10억" },
  { value: "100000-", label: "10억 이상" },
];

// 거래유형 텍스트
const getDealTypeText = (dealType: string) => {
  switch (dealType) {
    case "sale": return "매매";
    case "rent": return "전세";
    case "monthly": return "월세";
    default: return "";
  }
};

export default function MapPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState(DUMMY_PROPERTIES);

  // 필터 상태
  const [filters, setFilters] = useState({
    dealType: "all",
    category: "all",
    priceRange: "all",
  });

  // 좋아요 토글
  const toggleLike = (id: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isLiked: !p.isLiked, likeCount: p.isLiked ? p.likeCount - 1 : p.likeCount + 1 } : p
      )
    );
  };

  // 필터 적용
  const applyFilters = () => {
    setShowFilters(false);
    // 실제 구현에서는 여기서 API 호출
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      dealType: "all",
      category: "all",
      priceRange: "all",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen relative">
        {/* 헤더 */}
        <header className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 p-3">
            <button onClick={() => router.back()} className="p-1">
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex-1 flex items-center gap-2 h-10 bg-gray-100 rounded-lg px-3">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="지역, 단지명 검색"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <SlidersHorizontal size={20} className="text-gray-700" />
            </button>
          </div>

          {/* 필터 칩 */}
          <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-hide">
            {DEAL_TYPES.slice(1).map((type) => (
              <button
                key={type.value}
                onClick={() => setFilters((prev) => ({
                  ...prev,
                  dealType: prev.dealType === type.value ? "all" : type.value,
                }))}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  filters.dealType === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        </header>

        {/* 지도 영역 (플레이스홀더) */}
        <div className="h-screen bg-gray-200 relative pt-28">
          {/* 지도 배경 이미지 */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100">
            <div className="absolute inset-0 opacity-30">
              {/* 도로 패턴 */}
              <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-300" />
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-300" />
              <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-300" />
              <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-300" />
              <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-300" />
              <div className="absolute top-0 bottom-0 left-3/4 w-2 bg-gray-300" />
            </div>
          </div>

          {/* 매물 마커들 */}
          {properties.map((property, index) => {
            const positions = [
              { top: "30%", left: "25%" },
              { top: "45%", left: "60%" },
              { top: "55%", left: "30%" },
              { top: "40%", left: "75%" },
            ];
            const pos = positions[index % positions.length];
            const categoryInfo = CATEGORY_CONFIG[property.category];

            return (
              <button
                key={property.id}
                onClick={() => setSelectedProperty(property)}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-full z-10 transition-all",
                  selectedProperty?.id === property.id && "scale-110 z-20"
                )}
                style={{ top: pos.top, left: pos.left }}
              >
                <div className={cn(
                  "px-3 py-1.5 rounded-lg shadow-lg text-white font-bold text-sm",
                  categoryInfo.color
                )}>
                  {formatPrice(property.price)}
                </div>
                <div className={cn(
                  "w-0 h-0 mx-auto border-l-[8px] border-r-[8px] border-t-[8px] border-transparent",
                  categoryInfo.color === "bg-purple-500" && "border-t-purple-500",
                  categoryInfo.color === "bg-orange-500" && "border-t-orange-500",
                  categoryInfo.color === "bg-green-500" && "border-t-green-500",
                  categoryInfo.color === "bg-blue-500" && "border-t-blue-500",
                  categoryInfo.color === "bg-pink-500" && "border-t-pink-500",
                )} />
              </button>
            );
          })}

          {/* 현재 위치 버튼 */}
          <button className="absolute bottom-32 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <MapPin size={24} className="text-blue-600" />
          </button>
        </div>

        {/* 선택된 매물 카드 */}
        {selectedProperty && (
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-4 z-30">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 p-1"
            >
              <X size={20} className="text-gray-400" />
            </button>

            <Link href={`/property/${selectedProperty.id}`}>
              <div className="flex gap-3">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.title}
                    fill
                    className="object-cover"
                  />
                  <span className={cn(
                    "absolute top-1 left-1 px-1.5 py-0.5 text-xs font-semibold text-white rounded",
                    CATEGORY_CONFIG[selectedProperty.category].color
                  )}>
                    {CATEGORY_CONFIG[selectedProperty.category].label}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                    {getDealTypeText(selectedProperty.dealType)}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {formatPrice(selectedProperty.price)}
                  </p>
                  <p className="text-sm text-gray-900 truncate">{selectedProperty.title}</p>
                  <p className="text-xs text-gray-500">{selectedProperty.address}</p>
                  <p className="text-xs text-gray-400">{formatArea(selectedProperty.exclusiveArea)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleLike(selectedProperty.id);
                  }}
                  className="self-start p-2"
                >
                  <Heart
                    size={22}
                    className={cn(
                      selectedProperty.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-300"
                    )}
                  />
                </button>
              </div>
            </Link>
          </div>
        )}

        {/* 필터 모달 */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute bottom-0 w-full max-w-[430px] bg-white rounded-t-2xl">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">필터</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {/* 거래유형 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">거래유형</h3>
                  <div className="flex flex-wrap gap-2">
                    {DEAL_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFilters((prev) => ({ ...prev, dealType: type.value }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          filters.dealType === type.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 매물유형 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">매물유형</h3>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFilters((prev) => ({ ...prev, category: cat.value }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          filters.category === cat.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 가격대 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">가격대</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setFilters((prev) => ({ ...prev, priceRange: range.value }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          filters.priceRange === range.value
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        )}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 버튼 */}
              <div className="p-4 border-t border-gray-200 flex gap-3">
                <Button variant="outline" size="full" onClick={resetFilters}>
                  초기화
                </Button>
                <Button size="full" onClick={applyFilters}>
                  적용하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
