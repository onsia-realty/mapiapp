/**
 * 이 단지 매물 Mock 데이터
 * 요구제기서 15번 - 아파트(임대차) 매물
 * 향후 앱에 등록된 실제 매물로 대체 예정
 */

// 거래 유형
export type ListingType = "SALE" | "JEONSE" | "MONTHLY";

// 매물 상태
export type ListingStatus = "ACTIVE" | "RESERVED" | "COMPLETED";

/**
 * 일반 부동산 매물 (매매/전세/월세)
 */
export interface RealEstateListing {
  id: string;

  // 단지 연결
  complexId: string; // 단지 ID (bunyanggwonId 또는 apartmentId)
  complexName: string; // 단지명

  // 기본 정보
  dong: string; // 동
  ho: string; // 호
  type: string; // 타입 (59A, 84B 등)
  exclusiveArea: number; // 전용면적 (㎡)
  floor: number; // 층
  totalFloors: number; // 총 층수
  direction: string; // 향 (남향, 동향 등)

  // 거래 정보
  listingType: ListingType; // 매매/전세/월세
  salePrice?: number; // 매매가 (만원)
  deposit?: number; // 보증금 (만원)
  monthlyRent?: number; // 월세 (만원)

  // 관리비
  maintenanceFee?: number; // 관리비 (만원)

  // 입주 정보
  moveInDate: string; // 입주가능일
  moveInType: "IMMEDIATE" | "NEGOTIABLE" | "SCHEDULED"; // 즉시/협의/예정

  // 특징
  features: string[]; // 특징 태그 (예: "풀옵션", "역세권", "신축")
  description: string; // 상세 설명

  // 이미지
  images: string[];

  // 통계
  viewCount: number;
  likeCount: number;

  // 상태
  status: ListingStatus;

  // 등록 정보
  registeredAt: Date;
  updatedAt: Date;
}

/**
 * 금액을 한글 형식으로 변환 (억/만원)
 */
export function formatListingPrice(amount: number): string {
  if (amount >= 10000) {
    const eok = Math.floor(amount / 10000);
    const man = amount % 10000;
    if (man === 0) {
      return `${eok}억`;
    }
    return `${eok}억 ${man.toLocaleString()}`;
  }
  return `${amount.toLocaleString()}만`;
}

/**
 * 거래 유형 라벨
 */
export function getListingTypeLabel(type: ListingType): string {
  switch (type) {
    case "SALE":
      return "매매";
    case "JEONSE":
      return "전세";
    case "MONTHLY":
      return "월세";
  }
}

/**
 * 거래 유형별 색상
 */
export function getListingTypeColor(type: ListingType): string {
  switch (type) {
    case "SALE":
      return "bg-blue-100 text-blue-700";
    case "JEONSE":
      return "bg-purple-100 text-purple-700";
    case "MONTHLY":
      return "bg-orange-100 text-orange-700";
  }
}

// ============================================
// Mock 데이터
// ============================================

export const mockRealEstateListings: RealEstateListing[] = [
  // BY001 (경남아너스빌) 매물
  {
    id: "LST001",
    complexId: "BUN001",
    complexName: "경남아너스빌",
    dong: "101",
    ho: "1502",
    type: "59A",
    exclusiveArea: 59.98,
    floor: 15,
    totalFloors: 25,
    direction: "남향",
    listingType: "SALE",
    salePrice: 28000, // 2억 8,000만
    maintenanceFee: 15,
    moveInDate: "즉시입주",
    moveInType: "IMMEDIATE",
    features: ["올수리", "역세권", "학군우수"],
    description: "올수리 완료된 깨끗한 매물입니다. 역 도보 5분거리.",
    images: [],
    viewCount: 127,
    likeCount: 23,
    status: "ACTIVE",
    registeredAt: new Date("2026-01-08"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "LST002",
    complexId: "BUN001",
    complexName: "경남아너스빌",
    dong: "102",
    ho: "803",
    type: "84B",
    exclusiveArea: 84.92,
    floor: 8,
    totalFloors: 25,
    direction: "남동향",
    listingType: "JEONSE",
    deposit: 35000, // 3억 5,000만
    maintenanceFee: 18,
    moveInDate: "2026년 2월",
    moveInType: "SCHEDULED",
    features: ["풀옵션", "주차2대"],
    description: "풀옵션 전세. 주차 2대 가능합니다.",
    images: [],
    viewCount: 89,
    likeCount: 15,
    status: "ACTIVE",
    registeredAt: new Date("2026-01-05"),
    updatedAt: new Date("2026-01-09"),
  },
  {
    id: "LST003",
    complexId: "BUN001",
    complexName: "경남아너스빌",
    dong: "103",
    ho: "2101",
    type: "84A",
    exclusiveArea: 84.98,
    floor: 21,
    totalFloors: 25,
    direction: "남향",
    listingType: "MONTHLY",
    deposit: 5000, // 5,000만
    monthlyRent: 120, // 120만
    maintenanceFee: 18,
    moveInDate: "협의가능",
    moveInType: "NEGOTIABLE",
    features: ["고층", "탁트인조망", "신혼부부추천"],
    description: "고층 로얄동 탁트인 조망. 신혼부부에게 추천드립니다.",
    images: [],
    viewCount: 156,
    likeCount: 31,
    status: "ACTIVE",
    registeredAt: new Date("2026-01-03"),
    updatedAt: new Date("2026-01-10"),
  },

  // BY002 (래미안원베일리) 매물
  {
    id: "LST004",
    complexId: "BUN002",
    complexName: "래미안원베일리",
    dong: "201",
    ho: "3201",
    type: "84A",
    exclusiveArea: 84.97,
    floor: 32,
    totalFloors: 35,
    direction: "한강뷰",
    listingType: "SALE",
    salePrice: 450000, // 45억
    maintenanceFee: 45,
    moveInDate: "협의",
    moveInType: "NEGOTIABLE",
    features: ["한강뷰", "로열층", "프리미엄"],
    description: "한강뷰 로열층 프리미엄 매물. 실입주 가능.",
    images: [],
    viewCount: 523,
    likeCount: 89,
    status: "ACTIVE",
    registeredAt: new Date("2026-01-07"),
    updatedAt: new Date("2026-01-10"),
  },
  {
    id: "LST005",
    complexId: "BUN002",
    complexName: "래미안원베일리",
    dong: "202",
    ho: "2505",
    type: "59B",
    exclusiveArea: 59.91,
    floor: 25,
    totalFloors: 35,
    direction: "남향",
    listingType: "JEONSE",
    deposit: 180000, // 18억
    maintenanceFee: 35,
    moveInDate: "2026년 3월",
    moveInType: "SCHEDULED",
    features: ["신축", "풀옵션"],
    description: "신축 풀옵션 전세. 역세권 초역세권.",
    images: [],
    viewCount: 312,
    likeCount: 45,
    status: "ACTIVE",
    registeredAt: new Date("2026-01-06"),
    updatedAt: new Date("2026-01-09"),
  },
];

/**
 * 단지 ID로 매물 목록 조회
 */
export function getListingsByComplexId(complexId: string): RealEstateListing[] {
  return mockRealEstateListings.filter(
    (listing) => listing.complexId === complexId && listing.status === "ACTIVE"
  );
}

/**
 * 거래 유형별 매물 조회
 */
export function getListingsByType(
  complexId: string,
  listingType: ListingType
): RealEstateListing[] {
  return mockRealEstateListings.filter(
    (listing) =>
      listing.complexId === complexId &&
      listing.listingType === listingType &&
      listing.status === "ACTIVE"
  );
}
