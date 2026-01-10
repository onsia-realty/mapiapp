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

  // BUN002: 중흥S-클래스더포레 매물들
  {
    id: "MAPI004",
    registrationNo: "895366",
    bunyanggwonId: "BUN002",

    propertyName: "중흥S-클래스더포레",
    dong: "101",
    ho: "802",
    type: "84B",
    exclusiveArea: 59.98,
    supplyArea: 84.95,
    floor: 8,
    totalFloors: 29,
    direction: "남향",

    salePrice: 81400,
    originalPrice: 81400,
    premium: 0,
    premiumType: "NONE",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 12월",

    nearestStation: "구리역",
    stationDistance: "도보 10분",

    viewCount: 945,
    likeCount: 42,

    description: `분양가 그대로 매도합니다.
역세권 + 학군 우수 지역입니다.
남향 중층으로 채광 좋습니다.`,

    images: [],

    broker: {
      name: "온시아공인중개사",
      representative: "김영희",
      businessNo: "234-56-78901",
      address: "경기도 구리시 교문동 123-4",
      registrationNo: "제2024-0003호",
      phone: "031-345-6789",
    },

    complexInfo: {
      name: "중흥S-클래스더포레",
      address: "경기도 구리시 교문동",
      totalHouseholds: 1250,
      totalBuildings: 8,
      maxFloor: 29,
      moveInDate: "2026년 12월",
      constructor: "중흥건설(주)",
    },

    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI005",
    registrationNo: "895367",
    bunyanggwonId: "BUN002",

    propertyName: "중흥S-클래스더포레",
    dong: "102",
    ho: "1503",
    type: "84B",
    exclusiveArea: 59.98,
    supplyArea: 84.95,
    floor: 15,
    totalFloors: 29,
    direction: "남동향",

    salePrice: 83400,
    originalPrice: 81400,
    premium: 2000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 12월",

    nearestStation: "구리역",
    stationDistance: "도보 10분",

    viewCount: 1123,
    likeCount: 67,

    description: `고층 로열층 매물입니다.
조망권 우수하며 프리미엄 2,000만원입니다.`,

    images: [],

    broker: {
      name: "부동산114공인중개사",
      representative: "박철수",
      businessNo: "345-67-89012",
      address: "경기도 구리시 교문동 456-7",
      registrationNo: "제2024-0004호",
      phone: "031-456-7890",
    },

    complexInfo: {
      name: "중흥S-클래스더포레",
      address: "경기도 구리시 교문동",
      totalHouseholds: 1250,
      totalBuildings: 8,
      maxFloor: 29,
      moveInDate: "2026년 12월",
      constructor: "중흥건설(주)",
    },

    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN003: 목동온프트하임 매물들
  {
    id: "MAPI006",
    registrationNo: "895368",
    bunyanggwonId: "BUN003",

    propertyName: "목동온프트하임",
    dong: "A",
    ho: "1201",
    type: "84A",
    exclusiveArea: 59.5,
    supplyArea: 84.0,
    floor: 12,
    totalFloors: 35,
    direction: "남향",

    salePrice: 125000,
    originalPrice: 120000,
    premium: 5000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 12월",

    nearestStation: "목동역",
    stationDistance: "도보 5분",

    viewCount: 2345,
    likeCount: 156,

    description: `목동 학군 최고!
명문학군 도보거리 프리미엄 매물입니다.
실입주 또는 투자 모두 강력 추천!`,

    images: [],

    broker: {
      name: "목동부동산",
      representative: "이민수",
      businessNo: "456-78-90123",
      address: "서울 양천구 목동 789-1",
      registrationNo: "제2024-0005호",
      phone: "02-123-4567",
    },

    complexInfo: {
      name: "목동온프트하임",
      address: "서울특별시 양천구 목동",
      totalHouseholds: 890,
      totalBuildings: 5,
      maxFloor: 35,
      moveInDate: "2026년 12월",
      constructor: "현대건설(주)",
    },

    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI007",
    registrationNo: "895369",
    bunyanggwonId: "BUN003",

    propertyName: "목동온프트하임",
    dong: "B",
    ho: "2501",
    type: "84A",
    exclusiveArea: 59.5,
    supplyArea: 84.0,
    floor: 25,
    totalFloors: 35,
    direction: "남서향",

    salePrice: 132000,
    originalPrice: 120000,
    premium: 12000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 12월",

    nearestStation: "목동역",
    stationDistance: "도보 5분",

    viewCount: 3456,
    likeCount: 234,

    description: `고층 로열동 로열층!
한강 조망 가능한 최고의 뷰입니다.
프리미엄 1억2천만원이지만 가치 있습니다.`,

    images: [],

    broker: {
      name: "목동부동산",
      representative: "이민수",
      businessNo: "456-78-90123",
      address: "서울 양천구 목동 789-1",
      registrationNo: "제2024-0005호",
      phone: "02-123-4567",
    },

    complexInfo: {
      name: "목동온프트하임",
      address: "서울특별시 양천구 목동",
      totalHouseholds: 890,
      totalBuildings: 5,
      maxFloor: 35,
      moveInDate: "2026년 12월",
      constructor: "현대건설(주)",
    },

    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN004: 송도 자이 더 스타 매물들
  {
    id: "MAPI008",
    registrationNo: "895370",
    bunyanggwonId: "BUN004",

    propertyName: "송도 자이 더 스타",
    dong: "101",
    ho: "1001",
    type: "84C",
    exclusiveArea: 60.0,
    supplyArea: 84.5,
    floor: 10,
    totalFloors: 42,
    direction: "남향",

    salePrice: 97000,
    originalPrice: 95000,
    premium: 2000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2027년 8월",

    nearestStation: "센트럴파크역",
    stationDistance: "도보 3분",

    viewCount: 1876,
    likeCount: 98,

    description: `센트럴파크 조망 가능!
송도 최고 입지 자이 분양권입니다.
GTX-B 호재로 미래가치 상승 기대!`,

    images: [],

    broker: {
      name: "송도부동산",
      representative: "정대현",
      businessNo: "567-89-01234",
      address: "인천 연수구 송도동 123-4",
      registrationNo: "제2024-0006호",
      phone: "032-123-4567",
    },

    complexInfo: {
      name: "송도 자이 더 스타",
      address: "인천광역시 연수구 송도동",
      totalHouseholds: 1560,
      totalBuildings: 12,
      maxFloor: 42,
      moveInDate: "2027년 8월",
      constructor: "GS건설(주)",
    },

    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI009",
    registrationNo: "895371",
    bunyanggwonId: "BUN004",

    propertyName: "송도 자이 더 스타",
    dong: "105",
    ho: "3201",
    type: "84C",
    exclusiveArea: 60.0,
    supplyArea: 84.5,
    floor: 32,
    totalFloors: 42,
    direction: "남동향",

    salePrice: 102000,
    originalPrice: 95000,
    premium: 7000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2027년 8월",

    nearestStation: "센트럴파크역",
    stationDistance: "도보 3분",

    viewCount: 2567,
    likeCount: 145,

    description: `고층 오션뷰 매물!
서해 바다 조망 가능한 프리미엄 층입니다.
송도 랜드마크 단지의 로열층!`,

    images: [],

    broker: {
      name: "인천부동산",
      representative: "최영진",
      businessNo: "678-90-12345",
      address: "인천 연수구 송도동 456-7",
      registrationNo: "제2024-0007호",
      phone: "032-234-5678",
    },

    complexInfo: {
      name: "송도 자이 더 스타",
      address: "인천광역시 연수구 송도동",
      totalHouseholds: 1560,
      totalBuildings: 12,
      maxFloor: 42,
      moveInDate: "2027년 8월",
      constructor: "GS건설(주)",
    },

    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN005: 부산 에코델타 더샵 매물들
  {
    id: "MAPI010",
    registrationNo: "895372",
    bunyanggwonId: "BUN005",

    propertyName: "부산 에코델타 더샵",
    dong: "201",
    ho: "501",
    type: "84D",
    exclusiveArea: 59.9,
    supplyArea: 84.8,
    floor: 5,
    totalFloors: 25,
    direction: "남향",

    salePrice: 64000,
    originalPrice: 65000,
    premium: -1000,
    premiumType: "MINUS",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 6월",

    nearestStation: "명지역(예정)",
    stationDistance: "도보 7분",

    viewCount: 756,
    likeCount: 34,

    description: `마이너스P 급매!
스마트시티 에코델타시티 분양권입니다.
부산 미래 핵심지역 선점 기회!`,

    images: [],

    broker: {
      name: "부산부동산",
      representative: "김부산",
      businessNo: "789-01-23456",
      address: "부산 강서구 명지동 123-4",
      registrationNo: "제2024-0008호",
      phone: "051-123-4567",
    },

    complexInfo: {
      name: "부산 에코델타 더샵",
      address: "부산광역시 강서구 명지동",
      totalHouseholds: 1120,
      totalBuildings: 9,
      maxFloor: 25,
      moveInDate: "2026년 6월",
      constructor: "포스코건설(주)",
    },

    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI011",
    registrationNo: "895373",
    bunyanggwonId: "BUN005",

    propertyName: "부산 에코델타 더샵",
    dong: "203",
    ho: "1801",
    type: "84D",
    exclusiveArea: 59.9,
    supplyArea: 84.8,
    floor: 18,
    totalFloors: 25,
    direction: "남서향",

    salePrice: 68000,
    originalPrice: 65000,
    premium: 3000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 6월",

    nearestStation: "명지역(예정)",
    stationDistance: "도보 7분",

    viewCount: 1234,
    likeCount: 67,

    description: `고층 조망권 우수!
낙동강 조망 가능한 로열층입니다.
프리미엄 3천만원 협의 가능!`,

    images: [],

    broker: {
      name: "명지부동산",
      representative: "박명지",
      businessNo: "890-12-34567",
      address: "부산 강서구 명지동 456-7",
      registrationNo: "제2024-0009호",
      phone: "051-234-5678",
    },

    complexInfo: {
      name: "부산 에코델타 더샵",
      address: "부산광역시 강서구 명지동",
      totalHouseholds: 1120,
      totalBuildings: 9,
      maxFloor: 25,
      moveInDate: "2026년 6월",
      constructor: "포스코건설(주)",
    },

    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN006: 대전 도안 롯데캐슬 매물들
  {
    id: "MAPI012",
    registrationNo: "895374",
    bunyanggwonId: "BUN006",

    propertyName: "대전 도안 롯데캐슬",
    dong: "101",
    ho: "701",
    type: "59",
    exclusiveArea: 42.5,
    supplyArea: 59.9,
    floor: 7,
    totalFloors: 28,
    direction: "남향",

    salePrice: 45000,
    originalPrice: 45000,
    premium: 0,
    premiumType: "NONE",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 9월",

    nearestStation: "도안역(예정)",
    stationDistance: "도보 10분",

    viewCount: 543,
    likeCount: 23,

    description: `분양가 그대로!
소형평수 실거주 추천 매물입니다.
도안신도시 핵심입지!`,

    images: [],

    broker: {
      name: "대전부동산",
      representative: "이대전",
      businessNo: "901-23-45678",
      address: "대전 서구 도안동 123-4",
      registrationNo: "제2024-0010호",
      phone: "042-123-4567",
    },

    complexInfo: {
      name: "대전 도안 롯데캐슬",
      address: "대전광역시 서구 도안동",
      totalHouseholds: 980,
      totalBuildings: 7,
      maxFloor: 28,
      moveInDate: "2026년 9월",
      constructor: "롯데건설(주)",
    },

    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI013",
    registrationNo: "895375",
    bunyanggwonId: "BUN006",

    propertyName: "대전 도안 롯데캐슬",
    dong: "103",
    ho: "1501",
    type: "59",
    exclusiveArea: 42.5,
    supplyArea: 59.9,
    floor: 15,
    totalFloors: 28,
    direction: "남동향",

    salePrice: 47000,
    originalPrice: 45000,
    premium: 2000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 9월",

    nearestStation: "도안역(예정)",
    stationDistance: "도보 10분",

    viewCount: 678,
    likeCount: 31,

    description: `고층 조망권!
도안호수공원 조망 가능합니다.
신혼부부, 1인가구 추천!`,

    images: [],

    broker: {
      name: "도안부동산",
      representative: "최도안",
      businessNo: "012-34-56789",
      address: "대전 서구 도안동 456-7",
      registrationNo: "제2024-0011호",
      phone: "042-234-5678",
    },

    complexInfo: {
      name: "대전 도안 롯데캐슬",
      address: "대전광역시 서구 도안동",
      totalHouseholds: 980,
      totalBuildings: 7,
      maxFloor: 28,
      moveInDate: "2026년 9월",
      constructor: "롯데건설(주)",
    },

    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN007: 판교 테크노밸리 오피스텔 매물들
  {
    id: "MAPI014",
    registrationNo: "895376",
    bunyanggwonId: "BUN007",

    propertyName: "판교 테크노밸리 오피스텔",
    dong: "A",
    ho: "501",
    type: "25",
    exclusiveArea: 20.0,
    supplyArea: 25.5,
    floor: 5,
    totalFloors: 20,
    direction: "남향",

    salePrice: 38000,
    originalPrice: 35000,
    premium: 3000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 3월",

    nearestStation: "판교역",
    stationDistance: "도보 5분",

    viewCount: 1567,
    likeCount: 89,

    description: `판교 테크노밸리 중심!
IT기업 밀집지역 투자가치 최고!
역세권 오피스텔 분양권!`,

    images: [],

    broker: {
      name: "판교부동산",
      representative: "김판교",
      businessNo: "123-45-67890",
      address: "경기도 성남시 분당구 판교동 123-4",
      registrationNo: "제2024-0012호",
      phone: "031-789-0123",
    },

    complexInfo: {
      name: "판교 테크노밸리 오피스텔",
      address: "경기도 성남시 분당구 판교동",
      totalHouseholds: 350,
      totalBuildings: 2,
      maxFloor: 20,
      moveInDate: "2026년 3월",
      constructor: "대우건설(주)",
    },

    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI015",
    registrationNo: "895377",
    bunyanggwonId: "BUN007",

    propertyName: "판교 테크노밸리 오피스텔",
    dong: "B",
    ho: "1201",
    type: "25",
    exclusiveArea: 20.0,
    supplyArea: 25.5,
    floor: 12,
    totalFloors: 20,
    direction: "남서향",

    salePrice: 40000,
    originalPrice: 35000,
    premium: 5000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 3월",

    nearestStation: "판교역",
    stationDistance: "도보 5분",

    viewCount: 2134,
    likeCount: 112,

    description: `고층 조망권!
카카오, 네이버 등 IT기업 인접!
안정적인 임대수익 기대!`,

    images: [],

    broker: {
      name: "분당부동산",
      representative: "이분당",
      businessNo: "234-56-78901",
      address: "경기도 성남시 분당구 판교동 456-7",
      registrationNo: "제2024-0013호",
      phone: "031-890-1234",
    },

    complexInfo: {
      name: "판교 테크노밸리 오피스텔",
      address: "경기도 성남시 분당구 판교동",
      totalHouseholds: 350,
      totalBuildings: 2,
      maxFloor: 20,
      moveInDate: "2026년 3월",
      constructor: "대우건설(주)",
    },

    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-09"),
  },

  // BUN008: 강남 테헤란로 오피스텔 매물들
  {
    id: "MAPI016",
    registrationNo: "895378",
    bunyanggwonId: "BUN008",

    propertyName: "강남 테헤란로 오피스텔",
    dong: "A",
    ho: "801",
    type: "30",
    exclusiveArea: 24.5,
    supplyArea: 30.2,
    floor: 8,
    totalFloors: 25,
    direction: "남향",

    salePrice: 60000,
    originalPrice: 55000,
    premium: 5000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 7월",

    nearestStation: "역삼역",
    stationDistance: "도보 3분",

    viewCount: 3456,
    likeCount: 198,

    description: `강남 핵심상권!
테헤란로 초역세권 오피스텔!
임대수익 + 시세차익 모두 기대!`,

    images: [],

    broker: {
      name: "강남부동산",
      representative: "박강남",
      businessNo: "345-67-89012",
      address: "서울 강남구 역삼동 123-4",
      registrationNo: "제2024-0014호",
      phone: "02-567-8901",
    },

    complexInfo: {
      name: "강남 테헤란로 오피스텔",
      address: "서울특별시 강남구 역삼동",
      totalHouseholds: 420,
      totalBuildings: 2,
      maxFloor: 25,
      moveInDate: "2026년 7월",
      constructor: "삼성물산(주)",
    },

    createdAt: new Date("2025-01-04"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI017",
    registrationNo: "895379",
    bunyanggwonId: "BUN008",

    propertyName: "강남 테헤란로 오피스텔",
    dong: "A",
    ho: "2001",
    type: "30",
    exclusiveArea: 24.5,
    supplyArea: 30.2,
    floor: 20,
    totalFloors: 25,
    direction: "남동향",

    salePrice: 65000,
    originalPrice: 55000,
    premium: 10000,
    premiumType: "PREMIUM",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 7월",

    nearestStation: "역삼역",
    stationDistance: "도보 3분",

    viewCount: 4567,
    likeCount: 267,

    description: `펜트하우스급 고층!
강남 스카이라인 조망!
프리미엄 1억이지만 가치있는 투자!`,

    images: [],

    broker: {
      name: "테헤란부동산",
      representative: "최테헤란",
      businessNo: "456-78-90123",
      address: "서울 강남구 역삼동 456-7",
      registrationNo: "제2024-0015호",
      phone: "02-678-9012",
    },

    complexInfo: {
      name: "강남 테헤란로 오피스텔",
      address: "서울특별시 강남구 역삼동",
      totalHouseholds: 420,
      totalBuildings: 2,
      maxFloor: 25,
      moveInDate: "2026년 7월",
      constructor: "삼성물산(주)",
    },

    createdAt: new Date("2025-01-03"),
    updatedAt: new Date("2025-01-09"),
  },
  {
    id: "MAPI018",
    registrationNo: "895380",
    bunyanggwonId: "BUN008",

    propertyName: "강남 테헤란로 오피스텔",
    dong: "B",
    ho: "301",
    type: "30",
    exclusiveArea: 24.5,
    supplyArea: 30.2,
    floor: 3,
    totalFloors: 25,
    direction: "동향",

    salePrice: 53000,
    originalPrice: 55000,
    premium: -2000,
    premiumType: "MINUS",

    downPayment: "1차 10% / 2차 10%",
    middlePayment: "60% (대출 가능)",
    balance: "20%",
    moveInDate: "2026년 7월",

    nearestStation: "역삼역",
    stationDistance: "도보 3분",

    viewCount: 1234,
    likeCount: 56,

    description: `마이너스P 급매!
저층이지만 강남 역세권!
급매로 2천만원 싸게!`,

    images: [],

    broker: {
      name: "역삼부동산",
      representative: "김역삼",
      businessNo: "567-89-01234",
      address: "서울 강남구 역삼동 789-1",
      registrationNo: "제2024-0016호",
      phone: "02-789-0123",
    },

    complexInfo: {
      name: "강남 테헤란로 오피스텔",
      address: "서울특별시 강남구 역삼동",
      totalHouseholds: 420,
      totalBuildings: 2,
      maxFloor: 25,
      moveInDate: "2026년 7월",
      constructor: "삼성물산(주)",
    },

    createdAt: new Date("2025-01-02"),
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
