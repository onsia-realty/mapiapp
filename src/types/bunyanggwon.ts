// 분양권 전매 타입 정의

export type PropertyType = 'APARTMENT' | 'OFFICETEL' | 'KNOWLEDGE_INDUSTRY';
export type PremiumType = 'PREMIUM' | 'MINUS' | 'NONE';
export type SalesStatus = 'VIP' | 'GENERAL';

export interface Bunyanggwon {
  id: string;
  apiId?: string; // 청약홈 API ID (주택관리번호)
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

/**
 * 마피(분양권 전매) 개별 매물 상세 - 요구제기서 23-25
 */
export interface MapiListing {
  id: string; // 매물 ID
  registrationNo: string; // 등록번호

  // 단지 연결 정보
  bunyanggwonId: string; // 단지 ID (Bunyanggwon.id)
  apiId?: string; // 청약홈 API ID

  // 기본 정보
  propertyName: string; // 단지명
  dong: string; // 동
  ho: string; // 호
  type: string; // 타입 (예: 59A)
  exclusiveArea: number; // 전용면적 (㎡)
  supplyArea: number; // 공급면적 (㎡)
  floor: number; // 층
  totalFloors: number; // 총 층수
  direction: string; // 방향 (남향, 동향 등)

  // 가격 정보
  salePrice: number; // 매매가 (만원)
  originalPrice: number; // 분양가 (만원)
  premium: number; // 프리미엄 (만원, 마이너스 가능)
  premiumType: PremiumType;

  // 계약 정보
  downPayment: string; // 계약금 (예: "1차 10% / 2차 10%")
  middlePayment: string; // 중도금 (예: "60% (대출 가능)")
  balance: string; // 잔금 (예: "20%")
  moveInDate: string; // 입주예정일

  // 교통 정보
  nearestStation?: string; // 가장 가까운 역
  stationDistance?: string; // 역까지 거리 (예: "도보 8분")

  // 통계
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수

  // 매물 설명
  description: string; // 판매자 설명

  // 이미지
  images: string[]; // 매물 이미지 (최대 10장)

  // 중개사 정보
  broker: {
    name: string; // 중개사명
    representative: string; // 대표
    businessNo: string; // 사업자번호
    address: string; // 주소
    registrationNo: string; // 등록번호
    phone?: string; // 전화번호
  };

  // 단지 정보 (간략)
  complexInfo: {
    name: string; // 단지명
    address: string; // 주소
    totalHouseholds: number; // 총 세대수
    totalBuildings: number; // 총 동수
    maxFloor: number; // 최고층
    moveInDate: string; // 입주예정
    constructor: string; // 건설사
  };

  createdAt: Date;
  updatedAt: Date;
}
