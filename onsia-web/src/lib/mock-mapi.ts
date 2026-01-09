// Mock 마피(분양권 전매) 개별 매물 데이터

import { MapiListing } from "@/types/bunyanggwon";

export const mockMapiListings: MapiListing[] = [
  {
    id: "MAPI001",
    registrationNo: "895363",
    bunyanggwonId: "BUN001",
    apiId: "2025000189",

    // 기본 정보
    propertyName: "클러스터용인 경남아너스빌",
    dong: "101",
    ho: "1201",
    type: "84A",
    exclusiveArea: 84.96,
    supplyArea: 111.44,
    floor: 5,
    totalFloors: 24,
    direction: "남향",

    // 가격 정보
    salePrice: 49600, // 4억 9,600만원
    originalPrice: 52600, // 5억 2,600만원
    premium: -3000, // -3,000만원 (마이너스P)
    premiumType: "MINUS",

    // 계약 정보
    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2028년 12월",

    // 교통 정보
    nearestStation: "양지IC",
    stationDistance: "차량 5분",

    // 통계
    viewCount: 1234,
    likeCount: 56,

    // 매물 설명
    description: `급하게 매도합니다.
분양가 대비 3,000만원 마이너스 급매입니다.
남향으로 채광 좋고, 역세권이라 교통 편리합니다.
중도금 대출 승계 가능합니다.
실입주 목적 또는 투자 목적 모두 추천드립니다.`,

    // 이미지
    images: [
      "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/floor01.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/dange_01_n4.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/premium_n5.jpg?new",
    ],

    // 중개사 정보
    broker: {
      name: "온시아공인중개사",
      representative: "홍길동",
      businessNo: "123-45-67890",
      address: "경기도 용인시 처인구 양지면 123-4",
      registrationNo: "제2024-0001호",
      phone: "031-123-4567",
    },

    // 단지 정보
    complexInfo: {
      name: "클러스터용인 경남아너스빌",
      address: "경기도 용인시 처인구 양지면 양지리713(양지지구1BL)",
      totalHouseholds: 997,
      totalBuildings: 6,
      maxFloor: 24,
      moveInDate: "2028년 12월",
      constructor: "에스엠스틸(주)",
    },

    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI002",
    registrationNo: "895364",
    bunyanggwonId: "BUN001",
    apiId: "2025000189",

    propertyName: "클러스터용인 경남아너스빌",
    dong: "102",
    ho: "503",
    type: "84B",
    exclusiveArea: 84.89,
    supplyArea: 111.35,
    floor: 5,
    totalFloors: 24,
    direction: "동향",

    salePrice: 52600,
    originalPrice: 52600,
    premium: 0,
    premiumType: "NONE",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2028년 12월",

    nearestStation: "양지IC",
    stationDistance: "차량 5분",

    viewCount: 856,
    likeCount: 32,

    description: `분양가 그대로 매도합니다.
프리미엄 없이 분양가 그대로 거래 가능합니다.
동향으로 아침 햇살이 좋습니다.
중도금 대출 승계 가능합니다.`,

    images: [
      "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/floor02.jpg?new",
    ],

    broker: {
      name: "온시아공인중개사",
      representative: "홍길동",
      businessNo: "123-45-67890",
      address: "경기도 용인시 처인구 양지면 123-4",
      registrationNo: "제2024-0001호",
      phone: "031-123-4567",
    },

    complexInfo: {
      name: "클러스터용인 경남아너스빌",
      address: "경기도 용인시 처인구 양지면 양지리713(양지지구1BL)",
      totalHouseholds: 997,
      totalBuildings: 6,
      maxFloor: 24,
      moveInDate: "2028년 12월",
      constructor: "에스엠스틸(주)",
    },

    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI003",
    registrationNo: "895365",
    bunyanggwonId: "BUN001",
    apiId: "2025000189",

    propertyName: "클러스터용인 경남아너스빌",
    dong: "103",
    ho: "1801",
    type: "123",
    exclusiveArea: 123.81,
    supplyArea: 158.92,
    floor: 18,
    totalFloors: 24,
    direction: "남서향",

    salePrice: 78600, // 7억 8,600만원
    originalPrice: 73600, // 7억 3,600만원
    premium: 5000, // +5,000만원 프리미엄
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2028년 12월",

    nearestStation: "양지IC",
    stationDistance: "차량 5분",

    viewCount: 2156,
    likeCount: 128,

    description: `고층 로열동 로열층 매물입니다.
123타입 대형 평수로 4인 가족 거주에 최적입니다.
남서향 고층으로 조망권이 탁월합니다.
프리미엄이 붙었지만 향후 시세 상승 기대됩니다.`,

    images: [
      "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/floor03_n1.jpg?new",
      "https://cluster-honorsville.co.kr/img/sub/premium_n5.jpg?new",
    ],

    broker: {
      name: "부동산114공인중개사",
      representative: "김철수",
      businessNo: "234-56-78901",
      address: "경기도 용인시 처인구 양지면 456-7",
      registrationNo: "제2024-0002호",
      phone: "031-234-5678",
    },

    complexInfo: {
      name: "클러스터용인 경남아너스빌",
      address: "경기도 용인시 처인구 양지면 양지리713(양지지구1BL)",
      totalHouseholds: 997,
      totalBuildings: 6,
      maxFloor: 24,
      moveInDate: "2028년 12월",
      constructor: "에스엠스틸(주)",
    },

    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-09"),
  },
];

// 단지별 매물 조회
export function getMapiListingsByBunyanggwonId(bunyanggwonId: string): MapiListing[] {
  return mockMapiListings.filter((listing) => listing.bunyanggwonId === bunyanggwonId);
}

// 개별 매물 조회
export function getMapiListingById(id: string): MapiListing | undefined {
  return mockMapiListings.find((listing) => listing.id === id);
}
