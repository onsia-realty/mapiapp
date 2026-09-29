export const RENTAL_CATEGORY_LABELS = {
  apartment: "아파트",
  officetel: "오피스텔",
  office: "사무실",
  store: "상가",
} as const;

export type RentalCategory = keyof typeof RENTAL_CATEGORY_LABELS;

export interface RentalDemoListing {
  id: string;
  propertyName: string;
  address: string;
  dealType: "SALE" | "RENT" | "MONTHLY";
  price?: number;
  deposit?: number;
  monthlyRent?: number;
  exclusiveArea: number;
  floor: string;
  region: string;
  image: string;
}

// Category cards and detail pages intentionally share the same demo records.
export const RENTAL_DEMO_LISTINGS: Record<RentalCategory, RentalDemoListing[]> = {
  apartment: [
    {
      id: "1",
      propertyName: "래미안 퍼스티지",
      address: "서울시 서초구 반포동",
      dealType: "SALE",
      price: 120000,
      exclusiveArea: 114.5,
      floor: "23층/35층",
      region: "서울",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop",
    },
    {
      id: "2",
      propertyName: "힐스테이트 강남",
      address: "서울시 강남구 역삼동",
      dealType: "RENT",
      deposit: 50000,
      monthlyRent: 150,
      exclusiveArea: 84.9,
      floor: "15층/25층",
      region: "서울",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop",
    },
  ],
  officetel: [
    {
      id: "1",
      propertyName: "힐스테이트 강남 오피스텔",
      address: "서울시 강남구 역삼동",
      dealType: "MONTHLY",
      deposit: 5000,
      monthlyRent: 80,
      exclusiveArea: 28.5,
      floor: "8층/15층",
      region: "서울",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop",
    },
  ],
  office: [
    {
      id: "1",
      propertyName: "강남 테헤란로 사무실",
      address: "서울시 강남구 테헤란로",
      dealType: "MONTHLY",
      deposit: 10000,
      monthlyRent: 300,
      exclusiveArea: 85.5,
      floor: "5층/15층",
      region: "서울",
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=400&fit=crop",
    },
  ],
  store: [
    {
      id: "1",
      propertyName: "강남역 1층 상가",
      address: "서울시 강남구 역삼동",
      dealType: "MONTHLY",
      deposit: 30000,
      monthlyRent: 500,
      exclusiveArea: 45.5,
      floor: "1층/10층",
      region: "서울",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop",
    },
  ],
};
