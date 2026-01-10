/**
 * 주변 입주예정 아파트 조회 API
 */

import { BunyanggwonData } from "@/types/api";

const API_KEY = process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL = "https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1";

/**
 * 주소에서 시/군/구 정보 추출
 * 예: "경기도 용인시 처인구 양지면..." → { city: "용인시", district: "처인구" }
 */
export function extractLocationFromAddress(address: string): {
  city: string;
  district: string;
} {
  const parts = address.split(" ").filter(Boolean);
  let city = "";
  let district = "";

  for (const part of parts) {
    // 시/군 찾기 (예: 용인시, 성남시, 화성시, 양평군)
    if (part.endsWith("시") || part.endsWith("군")) {
      if (!city) city = part;
    }
    // 구/읍/면 찾기 (예: 처인구, 분당구, 양지면)
    if (part.endsWith("구") || part.endsWith("읍") || part.endsWith("면")) {
      if (!district) district = part;
    }
  }

  return { city, district };
}

/**
 * 주변 입주예정 아파트 조회
 * 같은 지역의 입주예정 분양권 목록 (현재 물건 제외)
 * @param regionCode 시도 지역코드 (예: 410 = 경기도)
 * @param addressFilter 주소 기반 필터 (시/구 단위로 정밀 필터링)
 * @param excludeId 제외할 물건 ID
 * @param limit 최대 결과 수
 */
export async function getNearbyUpcomingApartments(
  regionCode: string,
  addressFilter?: string,
  excludeId?: string,
  limit: number = 5
): Promise<UpcomingApartment[]> {
  try {
    const queryParams = new URLSearchParams({
      page: "1",
      perPage: "100", // 더 많이 가져와서 필터링
      serviceKey: API_KEY,
    });

    if (regionCode) {
      queryParams.append("cond[SUBSCRPT_AREA_CODE::EQ]", regionCode);
    }

    // 주소에서 시/구 추출
    const targetLocation = addressFilter
      ? extractLocationFromAddress(addressFilter)
      : { city: "", district: "" };

    console.log("🏠 입주예정 아파트 API 호출:", {
      regionCode,
      addressFilter,
      targetLocation,
      excludeId,
    });

    const response = await fetch(
      `${BASE_URL}/getAPTLttotPblancDetail?${queryParams.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error("입주예정 API 응답 실패:", response.status);
      return [];
    }

    const data = await response.json();
    const items = data.data || [];

    const now = new Date();
    const apartments: UpcomingApartment[] = items
      .map((item: any) => transformToUpcomingApartment(item))
      .filter((apt: UpcomingApartment | null) => {
        if (!apt) return false;
        if (excludeId && apt.id === excludeId) return false;

        // 입주예정일이 미래인 것만
        if (apt.moveInDate) {
          const [year, month] = apt.moveInDate.split(".").map(Number);
          if (!isNaN(year) && !isNaN(month)) {
            const moveInDate = new Date(year, month - 1);
            if (moveInDate <= now) return false;
          }
        } else {
          return false;
        }

        // 주소 기반 필터링 (시/구 단위)
        if (targetLocation.city || targetLocation.district) {
          const aptAddress = apt.fullAddress || "";
          const aptLocation = extractLocationFromAddress(aptAddress);

          // 같은 시/군 체크 (필수)
          if (targetLocation.city && !aptAddress.includes(targetLocation.city)) {
            return false;
          }

          // 같은 구/읍/면 체크 (있으면 우선)
          if (targetLocation.district && aptAddress.includes(targetLocation.district)) {
            // 같은 구면 우선순위 높음 (나중에 정렬에 사용)
            apt.sameDistrict = true;
          }
        }

        return true;
      })
      // 같은 구 우선 정렬
      .sort((a: UpcomingApartment, b: UpcomingApartment) => {
        if (a.sameDistrict && !b.sameDistrict) return -1;
        if (!a.sameDistrict && b.sameDistrict) return 1;
        return 0;
      })
      .slice(0, limit);

    console.log(
      `✅ 입주예정 아파트 ${apartments.length}건 조회 완료 (${targetLocation.city} ${targetLocation.district})`
    );
    return apartments;
  } catch (error) {
    console.error("❌ 입주예정 아파트 조회 에러:", error);
    return [];
  }
}

/**
 * 입주예정 아파트 간략 정보
 */
export interface UpcomingApartment {
  id: string;
  name: string;
  district: string;
  fullAddress: string; // 전체 주소
  moveInDate: string; // YYYY.MM
  totalUnits: number;
  pyeong?: number;
  price?: number; // 만원
  sameDistrict?: boolean; // 같은 구/읍/면 여부 (정렬용)
}

/**
 * API 응답을 입주예정 아파트 형식으로 변환
 */
function transformToUpcomingApartment(item: any): UpcomingApartment | null {
  if (!item.HOUSE_NM) return null;

  const fullAddress = item.HSSPLY_ADRES || "";
  const addressParts = fullAddress.split(" ");

  // 지역 추출 (구/동 우선)
  const district =
    addressParts.find((part: string) => part.endsWith("구")) ||
    addressParts.find((part: string) => part.endsWith("동")) ||
    addressParts.find((part: string) => part.endsWith("읍")) ||
    addressParts.find((part: string) => part.endsWith("면")) ||
    "";

  // 입주예정일 포맷 (YYYYMM -> YYYY.MM)
  const moveIn = item.MVN_PREARNGE_YM || "";
  const moveInDate =
    moveIn.length === 6
      ? `${moveIn.substring(0, 4)}.${moveIn.substring(4, 6)}`
      : "";

  return {
    id: item.HOUSE_MANAGE_NO || item.PBLANC_NO || "",
    name: item.HOUSE_NM || "",
    district: district,
    fullAddress: fullAddress,
    moveInDate: moveInDate,
    totalUnits: parseInt(item.TOT_SUPLY_HSHLDCO || "0", 10),
    // price는 분양가 API 별도 호출 필요
  };
}

/**
 * 지역명에서 지역코드 추출
 */
export function getRegionCode(regionName: string): string {
  const regionMap: { [key: string]: string } = {
    서울: "100",
    인천: "280",
    경기: "410",
    부산: "260",
    대구: "270",
    광주: "290",
    대전: "300",
    울산: "310",
    세종: "360",
    강원: "420",
    충북: "430",
    충남: "440",
    전북: "450",
    전남: "460",
    경북: "470",
    경남: "480",
    제주: "490",
  };

  for (const [name, code] of Object.entries(regionMap)) {
    if (regionName.includes(name)) return code;
  }
  return "";
}

/**
 * 주소에서 지역코드 추출
 */
export function getRegionCodeFromAddress(address: string): string {
  return getRegionCode(address);
}
