/**
 * 청약홈 공공데이터 API 연동
 * 공공데이터포털: 한국부동산원_청약홈 분양정보 조회 서비스
 */

import { BunyanggwonData, PriceByType } from "@/types/api";

const API_KEY = process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL = "https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1";

/**
 * 청약홈 분양정보 조회
 * @param params 조회 파라미터
 * @returns 분양정보 목록
 */
export async function getApplyHomeList(params: {
  startDate?: string; // YYYY-MM-DD 형식
  endDate?: string; // YYYY-MM-DD 형식
  regionCode?: string; // 지역코드 (100:서울, 410:경기, 621:경남 등)
  houseType?: string; // 주택구분 (01:APT, 02:오피스텔 등)
  perPage?: number;
  page?: number;
}): Promise<BunyanggwonData[]> {
  try {
    // 기본 쿼리 파라미터
    const queryParams = new URLSearchParams({
      page: (params.page || 1).toString(),
      perPage: (params.perPage || 10).toString(),
      serviceKey: API_KEY,
    });

    // 조건 파라미터 추가 (cond[FIELD::OPERATOR] 형식)
    if (params.houseType) {
      queryParams.append("cond[HOUSE_SECD::EQ]", params.houseType);
    }

    if (params.regionCode) {
      queryParams.append("cond[SUBSCRPT_AREA_CODE::EQ]", params.regionCode);
    }

    // 모집공고일 범위 조건
    if (params.endDate) {
      queryParams.append("cond[RCRIT_PBLANC_DE::LTE]", params.endDate);
    }
    if (params.startDate) {
      queryParams.append("cond[RCRIT_PBLANC_DE::GTE]", params.startDate);
    }

    console.log("🔍 청약홈 API 호출:", {
      url: `${BASE_URL}/getAPTLttotPblancDetail`,
      params: Object.fromEntries(queryParams),
    });

    // API 호출
    const response = await fetch(
      `${BASE_URL}/getAPTLttotPblancDetail?${queryParams.toString()}`,
      {
        next: { revalidate: 3600 }, // 1시간마다 재검증
      }
    );

    if (!response.ok) {
      console.error("API 응답 실패:", response.status, response.statusText);
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data = await response.json();

    console.log("📊 API 응답:", {
      currentCount: data.currentCount,
      totalCount: data.totalCount,
      matchCount: data.matchCount,
    });

    // 데이터 변환
    const items = data.data || [];
    const result = items.map((item: any) => transformApplyHomeData(item));

    console.log(`✅ 청약홈 데이터 ${result.length}건 조회 완료`);
    return result;
  } catch (error) {
    console.error("❌ 청약홈 API 호출 에러:", error);
    return [];
  }
}

/**
 * 청약홈 API 데이터를 앱 데이터 형식으로 변환
 */
function transformApplyHomeData(item: any, priceInfo?: PriceByType[]): BunyanggwonData {
  // 상태 판단 로직
  const now = new Date();
  const subscriptionStart = new Date(item.RCEPT_BGNDE || item.SUBSCRPT_RCEPT_BGNDE || "");
  const subscriptionEnd = new Date(item.RCEPT_ENDDE || item.SUBSCRPT_RCEPT_ENDDE || "");
  const contractEnd = new Date(item.CNTRCT_CNCLS_ENDDE || "");

  let status: BunyanggwonData["status"] = "모집중";
  if (now >= subscriptionStart && now <= subscriptionEnd) {
    status = "청약접수중";
  } else if (now > subscriptionEnd && now < contractEnd) {
    status = "계약진행중";
  } else if (now > contractEnd) {
    status = "마감";
  }

  // 지역 추출 (주소에서 구 추출)
  const addressParts = (item.HSSPLY_ADRES || "").split(" ");
  const district = addressParts.find((part: string) => part.includes("구")) ||
                   addressParts.find((part: string) => part.includes("면")) || "";

  // 전화번호 포맷팅 (16600997 -> 1660-0997)
  const phone = item.MDHS_TELNO || item.MDL_TELNO || "";
  const formattedPhone = phone.length === 8 ? `${phone.slice(0, 4)}-${phone.slice(4)}` : phone;

  return {
    id: item.HOUSE_MANAGE_NO || item.PBLANC_NO,
    propertyName: item.HOUSE_NM || "",
    district: district,
    address: item.HSSPLY_ADRES || "",
    moveInDate: formatYearMonth(item.MVN_PREARNGE_YM),
    status: status,
    thumbnailUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop",

    schedule: {
      recruitmentDate: formatDate(item.RCRIT_PBLANC_DE),
      specialSupplyDate: formatDate(item.SPSPLY_RCEPT_BGNDE), // 특별공급일
      subscriptionStartDate: formatDate(item.GNRL_RNK1_CRSPAREA_RCPTDE || item.RCEPT_BGNDE), // 1순위
      subscriptionEndDate: formatDate(item.GNRL_RNK2_CRSPAREA_RCPTDE || item.RCEPT_ENDDE), // 2순위
      winnerAnnouncementDate: formatDate(item.PRZWNER_PRESNATN_DE),
      contractStartDate: formatDate(item.CNTRCT_CNCLS_BGNDE),
      contractEndDate: formatDate(item.CNTRCT_CNCLS_ENDDE),
    },

    supplyInfo: {
      location: item.HSSPLY_ADRES || "",
      totalUnits: parseInt(item.TOT_SUPLY_HSHLDCO || "0", 10),
      builder: item.CNSTRCT_ENTRPS_NM || item.BSNS_MBY_NM || "", // 시공사
      operator: item.BSNS_MBY_NM || "", // 시행사
      phone: formattedPhone,
    },

    priceInfo: priceInfo,

    houseType: item.HOUSE_SECD_NM || "아파트",
    region: item.SUBSCRPT_AREA_CODE_NM || "",
    announcementUrl: item.PBLANC_URL,
    homepageUrl: item.HMPG_ADRES, // 분양 홈페이지
  };
}

/**
 * 날짜 포맷 변환 (YYYYMMDD 또는 YYYY-MM-DD -> YYYY.MM.DD)
 */
function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  // YYYY-MM-DD 형식 처리
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-");
    return `${year}.${month}.${day}`;
  }

  // YYYYMMDD 형식 처리
  if (dateStr.length === 8) {
    return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
  }

  return dateStr;
}

/**
 * 년월 포맷 변환 (YYYYMM -> YYYY.MM)
 */
function formatYearMonth(dateStr: string): string {
  if (!dateStr || dateStr.length !== 6) return "";
  return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}`;
}

/**
 * 평형별 분양가 정보 조회
 */
async function getApplyHomePriceInfo(id: string): Promise<PriceByType[]> {
  try {
    const queryParams = new URLSearchParams({
      page: "1",
      perPage: "50",
      serviceKey: API_KEY,
    });
    queryParams.append("cond[HOUSE_MANAGE_NO::EQ]", id);

    console.log("💰 분양가 정보 API 호출:", { id });

    const response = await fetch(
      `${BASE_URL}/getAPTLttotPblancMdl?${queryParams.toString()}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error("분양가 API 응답 실패:", response.status);
      return [];
    }

    const data = await response.json();
    const items = data.data || [];

    console.log(`✅ 분양가 정보 ${items.length}건 조회 완료`);

    return items.map((item: any) => {
      const exclusiveArea = parseFloat(item.HOUSE_TY?.replace(/[A-Z]/g, "").trim() || "0");
      const supplyArea = parseFloat(item.SUPLY_AR || "0");
      const pyeong = Math.round(exclusiveArea / 3.3058);

      // 타입명 추출 (84.9622A -> 84A)
      const typeMatch = item.HOUSE_TY?.match(/(\d+)\.?\d*([A-Z])?/);
      const typeName = typeMatch ? `${Math.round(parseFloat(typeMatch[1]))}${typeMatch[2] || ""}` : item.HOUSE_TY;

      return {
        type: typeName,
        exclusiveArea: exclusiveArea,
        supplyArea: supplyArea,
        pyeong: pyeong,
        price: parseInt(item.LTTOT_TOP_AMOUNT || "0", 10),
        totalUnits: parseInt(item.SUPLY_HSHLDCO || "0", 10) + parseInt(item.SPSPLY_HSHLDCO || "0", 10),
        generalUnits: parseInt(item.SUPLY_HSHLDCO || "0", 10),
        specialUnits: parseInt(item.SPSPLY_HSHLDCO || "0", 10),
      };
    });
  } catch (error) {
    console.error("❌ 분양가 정보 조회 에러:", error);
    return [];
  }
}

/**
 * 특정 분양권 상세 조회 (분양가 포함)
 * ID(주택관리번호 또는 공고번호)로 직접 필터링하여 조회
 */
export async function getApplyHomeDetail(id: string): Promise<BunyanggwonData | null> {
  try {
    // 기본 쿼리 파라미터
    const queryParams = new URLSearchParams({
      page: "1",
      perPage: "100", // 더 많은 데이터에서 검색
      serviceKey: API_KEY,
    });

    // ID 조건 추가
    queryParams.append("cond[HOUSE_MANAGE_NO::EQ]", id);

    console.log("🔍 청약홈 상세 API 호출:", {
      url: `${BASE_URL}/getAPTLttotPblancDetail`,
      id: id,
    });

    const response = await fetch(
      `${BASE_URL}/getAPTLttotPblancDetail?${queryParams.toString()}`,
      {
        next: { revalidate: 3600 }, // 1시간마다 재검증
      }
    );

    if (!response.ok) {
      console.error("API 응답 실패:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    console.log("📊 API 응답:", {
      currentCount: data.currentCount,
      totalCount: data.totalCount,
    });

    // 데이터 변환
    const items = data.data || [];
    if (items.length === 0) {
      console.log("⚠️ 해당 ID의 분양권을 찾을 수 없습니다:", id);
      return null;
    }

    // 분양가 정보도 함께 조회
    const priceInfo = await getApplyHomePriceInfo(id);

    console.log(`✅ 청약홈 상세 데이터 조회 완료: ${items[0].HOUSE_NM}`);
    return transformApplyHomeData(items[0], priceInfo);
  } catch (error) {
    console.error("❌ 청약홈 상세 조회 에러:", error);
    return null;
  }
}
