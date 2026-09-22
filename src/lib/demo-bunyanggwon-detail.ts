import { mockBunyanggwon } from "@/lib/mock-bunyanggwon";
import { BunyanggwonData } from "@/types/api";

const HONORSVILLE_ID = "2025000189";

/**
 * 청약홈에서 확인해 보관한 전달용 상세 스냅샷입니다.
 * 실 API가 오래된 공고를 반환하지 않을 때만 fallback으로 사용합니다.
 */
const honorsvilleDetail: BunyanggwonData = {
  id: HONORSVILLE_ID,
  propertyName: "클러스터용인 경남아너스빌",
  district: "용인시 처인구",
  address: "경기도 용인시 처인구 양지면 양지리713(양지지구1BL)",
  moveInDate: "2028년 12월",
  status: "마감",
  thumbnailUrl:
    "https://cluster-honorsville.co.kr/img/sub/business_open_n2.jpg?new",
  schedule: {
    recruitmentDate: "2025-07-11",
    specialSupplyDate: "2025-07-16",
    subscriptionStartDate: "2025-07-16",
    subscriptionEndDate: "2025-07-18",
    winnerAnnouncementDate: "2025-07-24",
    contractStartDate: "2025-08-05",
    contractEndDate: "2025-08-07",
  },
  supplyInfo: {
    location: "경기도 용인시 처인구 양지면 양지리713(양지지구1BL)",
    totalUnits: 997,
    builder: "에스엠스틸(주)",
    operator: "(주)삼라, 에스엠스틸(주)",
    phone: "1660-0997",
  },
  priceInfo: [
    {
      type: "84A",
      exclusiveArea: 84.9622,
      supplyArea: 111.44,
      pyeong: 34,
      price: 52600,
      totalUnits: 534,
      generalUnits: 267,
      specialUnits: 267,
    },
    {
      type: "84B",
      exclusiveArea: 84.8742,
      supplyArea: 111.33,
      pyeong: 34,
      price: 52600,
      totalUnits: 385,
      generalUnits: 193,
      specialUnits: 192,
    },
    {
      type: "123",
      exclusiveArea: 123.8242,
      supplyArea: 162.36,
      pyeong: 49,
      price: 73600,
      totalUnits: 78,
      generalUnits: 78,
      specialUnits: 0,
    },
  ],
  houseType: "아파트",
  region: "경기",
  announcementUrl:
    "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2025000189&pblancNo=2025000189",
  homepageUrl: "https://cluster-honorsville.co.kr/",
};

function toGenericDetail(
  mockItem: (typeof mockBunyanggwon)[number]
): BunyanggwonData {
  const unitsLabel = mockItem.features?.find((feature) => feature.includes("세대"));
  const totalUnits = Number(unitsLabel?.replace(/\D/g, "")) || 0;

  return {
    id: mockItem.apiId || mockItem.id,
    propertyName: mockItem.propertyName,
    district: mockItem.district || "",
    address: mockItem.address,
    moveInDate: mockItem.moveInDate || "",
    status: "마감",
    thumbnailUrl: mockItem.thumbnailUrl || "",
    schedule: {
      recruitmentDate: "",
      subscriptionStartDate: "",
      subscriptionEndDate: "",
      winnerAnnouncementDate: "",
      contractStartDate: "",
      contractEndDate: "",
    },
    supplyInfo: {
      location: mockItem.address,
      totalUnits,
      builder: mockItem.features?.[0] || "",
      operator: "",
      phone: mockItem.contactPhone ?? "",
    },
    priceInfo: [
      {
        type: mockItem.pyeong,
        exclusiveArea: mockItem.exclusiveArea,
        supplyArea: mockItem.supplyArea,
        pyeong: Math.round(mockItem.supplyArea / 3.3),
        price: mockItem.price,
        totalUnits,
        generalUnits: totalUnits,
        specialUnits: 0,
      },
    ],
    houseType: mockItem.type === "APARTMENT" ? "아파트" : "오피스텔",
    region: mockItem.region,
  };
}

export function getDemoBunyanggwonDetail(id: string): BunyanggwonData | null {
  if (id === HONORSVILLE_ID || id === "BUN001") {
    return honorsvilleDetail;
  }

  const mockItem = mockBunyanggwon.find(
    (item) => item.id === id || item.apiId === id
  );

  return mockItem ? toGenericDetail(mockItem) : null;
}

