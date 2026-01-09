// 분양권 전매 타입 정의

export type PropertyType = 'APARTMENT' | 'OFFICETEL' | 'KNOWLEDGE_INDUSTRY';
export type PremiumType = 'PREMIUM' | 'MINUS' | 'NONE';
export type SalesStatus = 'VIP' | 'GENERAL';

export interface Bunyanggwon {
  id: string;
  propertyName: string; // 단지명
  address: string; // 소재지
  type: PropertyType; // 매물 유형
  pyeong: string; // 평형 (예: 84A)
  supplyArea: number; // 공급면적 (㎡)
  exclusiveArea: number; // 전용면적 (㎡)

  // 가격 정보
  price: number; // 매매가 (만원)
  premium: number; // 프리미엄/마이너스 금액 (만원)
  premiumType: PremiumType; // 프리미엄 유형
  pricePerPyeong?: number; // 평당가 (만원)

  // 상태 정보
  salesStatus: SalesStatus; // 판매 상태
  moveInDate?: string; // 입주예정일

  // 위치 정보
  region: string; // 지역 (서울, 경기도 등)
  district?: string; // 상세 지역
  latitude?: number; // 위도
  longitude?: number; // 경도

  // 추가 정보
  thumbnailUrl?: string; // 썸네일 이미지
  description?: string; // 매물 설명
  features?: string[]; // 특징

  // 연락처
  contactPhone?: string;
  agentName?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface BunyanggwonDetail extends Bunyanggwon {
  // 상세 정보
  detailAddress?: string; // 상세 주소
  dong?: string; // 동
  ho?: string; // 호
  floor?: number; // 층
  totalFloors?: number; // 총 층수
  direction?: string; // 방향

  // 계약 정보
  contractDate?: string; // 계약일
  balancePaymentDate?: string; // 잔금일

  // 단지 정보
  totalHouseholds?: number; // 총 세대수
  parkingSpaces?: number; // 주차대수
  constructor?: string; // 건설사
  developer?: string; // 시공사

  // 주변 정보
  nearbySchools?: string[]; // 학군
  nearbyStations?: string[]; // 교통
  nearbyFacilities?: string[]; // 편의시설

  // 이미지
  images?: string[];
}
