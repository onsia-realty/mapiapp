/**
 * 온시아 앱 TypeScript 타입 정의
 */

// 사용자 유형
export type UserType = "general" | "broker";

// 소셜 로그인 제공자
export type SocialProvider = "kakao" | "naver" | "google" | "apple";

// 매물 카테고리
export type PropertyCategory =
  | "presale" // 분양권전매
  | "interestOnly" // 이자만
  | "profitable" // 수익형부동산
  | "office" // 사무실
  | "apartment" // 아파트
  | "job"; // 구인구직

// 거래 유형
export type DealType = "sale" | "rent" | "monthly";

// 매물 정보
export interface Property {
  id: string;
  category: PropertyCategory;
  title: string;
  address: string;
  price: number;
  monthlyRent?: number;
  deposit?: number;
  dealType: DealType;
  images: string[];
  description: string;
  exclusiveArea: number;
  supplyArea?: number;
  floor?: number;
  totalFloor?: number;
  buildingYear?: number;
  latitude: number;
  longitude: number;
  brokerName: string;
  brokerPhone: string;
  brokerOffice?: string;
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  // 추가 필드
  rooms?: number;
  bathrooms?: number;
  direction?: string;
  parking?: string;
  moveInDate?: string;
}

// 건축물대장 정보
export interface BuildingLedger {
  propertyId: string;
  buildingName: string;
  mainUse: string;
  totalFloorArea: number | string;
  buildingArea: number | string;
  landArea: number | string;
  structure: string;
  roofType: string;
  floors: string;
  height: number;
  approvalDate: string;
  buildingCoverage?: string;
  floorAreaRatio?: string;
}

// 카테고리 설정
export const CATEGORY_CONFIG = {
  presale: {
    label: "분양권전매",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    icon: "Building2",
  },
  interestOnly: {
    label: "이자만",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    icon: "Percent",
  },
  profitable: {
    label: "수익형부동산",
    color: "bg-green-500",
    textColor: "text-green-500",
    icon: "TrendingUp",
  },
  office: {
    label: "사무실",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    icon: "Building",
  },
  apartment: {
    label: "아파트",
    color: "bg-pink-500",
    textColor: "text-pink-500",
    icon: "Home",
  },
  job: {
    label: "구인구직",
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    icon: "Briefcase",
  },
} as const;
