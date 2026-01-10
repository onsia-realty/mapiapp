"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft, ChevronDown, Eye, Heart } from "lucide-react";

// 탭 타입
type TabType = "아파트" | "오피스텔" | "상가" | "지식산업센터";

// 거래형태 타입
type DealType = "전세" | "월세" | "단기임대" | "전체";

// 정렬 타입
type SortType = "최신순" | "월세 낮은순" | "보증금 낮은순" | "보증금 높은순" | "권리금 낮은순" | "면적 좁은순" | "면적 넓은순";

// Mock 데이터 - VIP 매물
const mockVipItems = [
  {
    id: "vip1",
    tab: "아파트" as TabType,
    targetAudience: "신혼부부, 대학생/직장인",
    isVip: true,
    monthlyRent: 5000,
    deposit: 200,
    originalDeposit: 300,
    discountedDeposit: 200,
    discountAmount: 100,
    jeonseDeposit: 40000,
    jeonseChange: 0,
    pyeongDang: 15,
    maintenanceFee: 30,
    exclusiveArea: 84,
    pyeong: 25.4,
    floor: "12층",
    features: ["입주청소 지원", "블라인드 설치", "풀옵션"],
    views: 5678,
    likes: 123,
    region: "서울",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop",
  },
  {
    id: "vip2",
    tab: "오피스텔" as TabType,
    targetAudience: "신혼부부, 대학생/직장인",
    isVip: true,
    monthlyRent: 3000,
    deposit: 150,
    originalDeposit: 200,
    discountedDeposit: 150,
    discountAmount: 50,
    jeonseDeposit: 25000,
    jeonseChange: -1000,
    pyeongDang: 12,
    maintenanceFee: 20,
    exclusiveArea: 59,
    pyeong: 17.8,
    floor: "8층",
    features: ["입주청소 지원", "풀옵션"],
    views: 3421,
    likes: 87,
    region: "서울",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
  },
];

// Mock 데이터 - 전체 매물
const mockItems = [
  {
    id: "1",
    tab: "아파트" as TabType,
    propertyName: "기타창업모음 · 언주역 도보 5분",
    dealType: "월세" as DealType,
    monthlyRent: 4000,
    deposit: 300,
    pyeongDang: 7.3,
    maintenanceFee: 50,
    exclusiveArea: 142.68,
    pyeong: 43.1,
    floor: "지상 6층",
    location: "강남구청역세권,넓은평수,올높은",
    registeredDate: "25.12.23",
    nearStation: "언주역 도보 5분",
    views: 3,
    likes: 0,
    region: "서울",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    tab: "오피스텔" as TabType,
    propertyName: "역삼동 오피스텔 · 역삼역 도보 3분",
    dealType: "전세" as DealType,
    jeonseDeposit: 35000,
    pyeongDang: 8.5,
    maintenanceFee: 15,
    exclusiveArea: 28.5,
    pyeong: 8.6,
    floor: "지상 10층",
    location: "역삼역세권,신축,풀옵션",
    registeredDate: "25.12.20",
    nearStation: "역삼역 도보 3분",
    views: 12,
    likes: 3,
    region: "서울",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    tab: "상가" as TabType,
    propertyName: "음식점/휴대폰가게/IT기업",
    targetAudience: "음식점/휴대폰가게/IT기업",
    dealType: "월세" as DealType,
    monthlyRent: 2500,
    deposit: 5000,
    originalDeposit: 6000,
    discountedDeposit: 5000,
    discountAmount: 1000,
    rentFree: 3,
    pyeongDang: 5.2,
    maintenanceFee: 0,
    exclusiveArea: 85.5,
    pyeong: 25.9,
    floor: "지상 2층",
    location: "강남역세권,코너자리,유동인구多",
    registeredDate: "25.12.18",
    nearStation: "강남역 도보 2분",
    views: 45,
    likes: 8,
    region: "서울",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    tab: "지식산업센터" as TabType,
    propertyName: "가산디지털단지 · IT기업 추천",
    dealType: "월세" as DealType,
    monthlyRent: 1800,
    deposit: 3000,
    pyeongDang: 4.8,
    maintenanceFee: 25,
    exclusiveArea: 165.2,
    pyeong: 50,
    floor: "지상 8층",
    location: "가산디지털단지역세권,주차편리",
    registeredDate: "25.12.15",
    nearStation: "가산디지털단지역 도보 5분",
    views: 28,
    likes: 5,
    region: "경기도",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop",
  },
];

export default function IjamanPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("아파트");
  const [selectedRegion, setSelectedRegion] = useState("전국");
  const [selectedDealType, setSelectedDealType] = useState<DealType>("전체");
  const [sortType, setSortType] = useState<SortType>("최신순");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // 필터 드롭다운 상태
  const [showDealTypeDropdown, setShowDealTypeDropdown] = useState(false);
  const [showDepositDropdown, setShowDepositDropdown] = useState(false);
  const [showRentDropdown, setShowRentDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showEtcDropdown, setShowEtcDropdown] = useState(false);

  const tabs: TabType[] = ["아파트", "오피스텔", "상가", "지식산업센터"];
  const regions = ["전국", "서울", "경기도", "인천", "부산", "대전"];
  const dealTypes: DealType[] = ["전체", "월세", "전세", "단기임대"];
  const sortTypes: SortType[] = ["최신순", "월세 낮은순", "보증금 낮은순", "보증금 높은순", "권리금 낮은순", "면적 좁은순", "면적 넓은순"];

  // 필터링
  const filteredVipItems = mockVipItems.filter((item) => {
    const matchesTab = item.tab === selectedTab;
    const matchesRegion = selectedRegion === "전국" || item.region === selectedRegion;
    return matchesTab && matchesRegion;
  });

  const filteredItems = mockItems.filter((item) => {
    const matchesTab = item.tab === selectedTab;
    const matchesRegion = selectedRegion === "전국" || item.region === selectedRegion;
    const matchesDealType = selectedDealType === "전체" || item.dealType === selectedDealType;
    return matchesTab && matchesRegion && matchesDealType;
  });

  const closeAllDropdowns = () => {
    setShowDealTypeDropdown(false);
    setShowDepositDropdown(false);
    setShowRentDropdown(false);
    setShowAreaDropdown(false);
    setShowEtcDropdown(false);
    setShowSortDropdown(false);
  };

  return (
    <MobileLayout>
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="flex items-center gap-3 px-5 py-4">
          <Link href="/">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">이자만</h1>
        </div>

        {/* 탭 영역 */}
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-3 text-sm font-medium text-center ${
                selectedTab === tab
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 px-5 py-3 overflow-x-auto bg-white">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-1.5 text-sm whitespace-nowrap rounded-full font-medium ${
                selectedRegion === region
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* 상세 필터 */}
        <div className="flex gap-2 px-5 py-2 overflow-x-auto border-b border-gray-100">
          {/* 거래형태 */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowDealTypeDropdown(!showDealTypeDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md whitespace-nowrap"
            >
              거래형태
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDealTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px]">
                {dealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedDealType(type);
                      setShowDealTypeDropdown(false);
                    }}
                    className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                      selectedDealType === type ? "text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 보증금 */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowDepositDropdown(!showDepositDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md whitespace-nowrap"
            >
              보증금
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDepositDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                {["전체", "1천만 이하", "3천만 이하", "5천만 이하", "1억 이하", "1억 초과"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowDepositDropdown(false)}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 월세 */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowRentDropdown(!showRentDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md whitespace-nowrap"
            >
              월세
              <ChevronDown className="w-4 h-4" />
            </button>
            {showRentDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                {["전체", "50만 이하", "100만 이하", "200만 이하", "300만 이하", "300만 초과"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowRentDropdown(false)}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 면적 */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowAreaDropdown(!showAreaDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md whitespace-nowrap"
            >
              면적
              <ChevronDown className="w-4 h-4" />
            </button>
            {showAreaDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                {["전체", "10평 이하", "20평 이하", "30평 이하", "50평 이하", "50평 초과"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowAreaDropdown(false)}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 기타 */}
          <div className="relative">
            <button
              onClick={() => {
                closeAllDropdowns();
                setShowEtcDropdown(!showEtcDropdown);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md whitespace-nowrap"
            >
              기타
              <ChevronDown className="w-4 h-4" />
            </button>
            {showEtcDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                {["렌트프리", "권리금 없음", "1층만", "역세권"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setShowEtcDropdown(false)}
                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 pb-10" onClick={closeAllDropdowns}>
        {/* VIP 매물 섹션 */}
        {filteredVipItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-900">- VIP 매물 -</span>
            </div>

            <div className="space-y-4">
              {filteredVipItems.map((item) => (
                <Link
                  href={`/category/ijaman/${item.id}`}
                  key={item.id}
                  className="block bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* 이미지 - 풀너비 */}
                  <div className="relative w-full aspect-[16/9] bg-gray-200">
                    <Image
                      src={item.image}
                      alt="매물 이미지"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>

                  {/* 정보 영역 */}
                  <div className="p-4">
                    {/* 추천 대상 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">
                        [VIP]
                      </span>
                      <span className="text-sm text-gray-900">
                        {item.targetAudience}
                      </span>
                    </div>

                    {/* 가격 정보 */}
                    <div className="mb-2">
                      <span className="text-sm text-red-600 font-bold">
                        월세 보증금/월세 (빨간색 강조)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-orange-600">●</span>
                      <span className="text-sm">
                        최초 {item.originalDeposit}만 → {item.discountedDeposit}만 ({item.discountAmount}만 인하!) ← 가격 히스토리
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      또는 급전세 {(item.jeonseDeposit / 10000).toFixed(0)}억 → {((item.jeonseDeposit + (item.jeonseChange || 0)) / 10000).toFixed(0)}억 ← 전세 가격 변동
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      평당 {item.pyeongDang}만 · 관리비 {item.maintenanceFee}만
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      전용 {item.exclusiveArea}m²({item.pyeong}평) · {item.floor}
                    </div>

                    {/* 특징 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">✨</span>
                      <span className="text-sm text-gray-600">
                        {item.features.join(" / ")}
                      </span>
                    </div>

                    {/* 조회수, 좋아요 */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 전체 매물 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">- 전체 매물 -</span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortDropdown(!showSortDropdown);
                }}
                className="flex items-center gap-1 text-sm text-gray-600"
              >
                {sortType}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                  {sortTypes.map((type) => (
                    <button
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortType(type);
                        setShowSortDropdown(false);
                      }}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                        sortType === type ? "text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 text-sm">매물이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Link
                  href={`/category/ijaman/${item.id}`}
                  key={item.id}
                  className="block bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex gap-3">
                    {/* 텍스트 정보 */}
                    <div className="flex-1 min-w-0">
                      {/* 추천 업종 (상가/지식산업센터인 경우) */}
                      {(item.tab === "상가" || item.tab === "지식산업센터") && item.targetAudience && (
                        <div className="text-xs text-gray-500 mb-1">
                          추천 업종 ({item.targetAudience}) [VIP]
                        </div>
                      )}

                      {/* 매물 이름/위치 */}
                      <div className="text-sm text-gray-900 mb-1">
                        {item.propertyName}
                      </div>

                      {/* 가격 정보 */}
                      <div className="text-sm font-bold text-red-600 mb-1">
                        {item.dealType === "전세" ? (
                          `전세 ${(item.jeonseDeposit! / 10000).toFixed(1)}억`
                        ) : (
                          `${item.dealType} ${item.deposit?.toLocaleString()}만/${item.monthlyRent?.toLocaleString()}만`
                        )}
                      </div>

                      {/* 상세 정보 */}
                      <div className="text-xs text-gray-600 mb-1">
                        평당 {item.pyeongDang}만 · 관리금 - · 관리비 {item.maintenanceFee}만
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        전용 {item.exclusiveArea}m²({item.pyeong}평) · {item.floor}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {item.location}
                      </div>

                      {/* 역 거리, 등록일 */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{item.nearStation}</span>
                        <span className="text-gray-400">{item.registeredDate}</span>
                      </div>

                      {/* 조회수, 좋아요 */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>조회 {item.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>좋아요 {item.likes}</span>
                        </div>
                      </div>
                    </div>

                    {/* 이미지 */}
                    <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.propertyName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="max-w-screen-sm mx-auto flex justify-around py-2">
          <Link href="/" className="flex flex-col items-center py-1 px-3 text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">홈</span>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center py-1 px-3 text-gray-400">
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">관심 목록</span>
          </Link>
          <Link href="/register" className="flex flex-col items-center py-1 px-3 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs mt-1">매물 등록</span>
          </Link>
          <Link href="/jobs" className="flex flex-col items-center py-1 px-3 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs mt-1">구인/구직</span>
          </Link>
          <Link href="/more" className="flex flex-col items-center py-1 px-3 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            <span className="text-xs mt-1">더보기</span>
          </Link>
        </div>
      </nav>
    </MobileLayout>
  );
}
