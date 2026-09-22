// 청약 정보 타입 정의

export interface Subscription {
  id: string;
  houseName: string; // 단지명
  address: string; // 공급위치
  totalHouseholds: number; // 총 공급세대수
  developer?: string; // 시공사
  constructor?: string; // 건설사
  recruitDate?: string; // 모집공고일
  receptionStart?: string; // 청약 접수 시작일
  receptionEnd?: string; // 청약 접수 종료일
  moveInDate?: string; // 입주예정년월
  avgPrice?: number; // 평균 분양가 (만원)
  avgPricePerPyeong?: number; // 평균 평당가 (만원)
  homepage?: string; // 공식 홈페이지
  phoneNumber?: string; // 대표전화
  thumbnailUrl?: string; // 썸네일 이미지
  latitude?: number; // 위도
  longitude?: number; // 경도
  status?: 'upcoming' | 'ongoing' | 'ended'; // 청약 상태

  // 청약 일정
  schedule?: {
    announcement?: string; // 분양공고
    specialSupply?: string; // 특별공급
    firstPriority?: string; // 1순위 청약
    secondPriority?: string; // 2순위 청약
    announcement2?: string; // 당첨자 발표
    contract?: string; // 계약시작
    contractEnd?: string; // 계약종료
  };

  // 주택형 정보
  housingTypes?: HousingType[];
}

export interface HousingType {
  id: string;
  subscriptionId: string;
  houseTy: string; // 주택형 (예: 084.8950A)
  supplyArea: number; // 공급면적 (㎡)
  exclusiveArea?: number; // 전용면적 (㎡)
  totalHouseholds: number; // 해당 타입 세대수
  topPrice?: number; // 최고분양가 (만원)
  pricePerPyeong?: number; // 평당가 (만원)

  // 공급 정보
  supply?: {
    general?: number; // 일반공급
    special?: number; // 특별공급
    total?: number; // 계
  };
}

export interface SubscriptionImage {
  id: string;
  subscriptionId: string;
  category: 'MODELHOUSE' | 'LOCATION' | 'LAYOUT' | 'UNIT_LAYOUT' |
            'FLOORPLAN' | 'GALLERY' | 'NOTICE_PDF' | 'PREMIUM' | 'COMMUNITY';
  url: string;
  order: number;
}

// 청약 예치금 정보
export interface DepositInfo {
  area: string; // 주택규모 (85㎡ 이하, 102㎡ 이하 등)
  seoul: string; // 서울/부산
  gyeonggi: string; // 기타광역
  others: string; // 기타시군
}
