/**
 * 국토교통부 아파트 실거래가 API 연동
 * 공공데이터포털: 국토교통부_아파트매매_실거래가_자료
 */

import { RealPriceAPIResponse, NearbyPriceData } from "@/types/api";
import { parseString } from "xml2js";
import { promisify } from "util";

const parseXML = promisify(parseString);

// 런타임에 환경 변수 읽기 (서버리스 환경 대응)
const getApiKey = () => process.env.DATA_GO_KR_API_KEY || "";
const BASE_URL = "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade";

/**
 * 주소 기반 주변 실거래가 조회
 * @param address 주소 (예: "서울특별시 강남구 역삼동")
 * @param yearMonth 조회 년월 (YYYYMM)
 * @returns 주변 실거래가 목록
 */
export async function getNearbyRealPrice(
  address: string,
  yearMonth?: string
): Promise<NearbyPriceData[]> {
  try {
    // 주소에서 지역코드 추출
    const regionCode = getRegionCode(address);
    if (!regionCode) {
      console.warn("지역코드를 찾을 수 없습니다:", address);
      return [];
    }

    // 년월이 없으면 최근 데이터가 있는 달로 조회 (2개월 전)
    const targetYearMonth = yearMonth || getPreviousYearMonth(2);

    const queryParams = new URLSearchParams({
      serviceKey: getApiKey(),
      LAWD_CD: regionCode, // 지역코드 (5자리)
      DEAL_YMD: targetYearMonth, // 거래년월 (YYYYMM)
      numOfRows: "100",
      pageNo: "1",
    });

    const apiUrl = `${BASE_URL}/getRTMSDataSvcAptTrade?${queryParams.toString()}`;
    console.log("🔍 실거래가 API 호출:", {
      address,
      regionCode,
      targetYearMonth,
      apiUrl: apiUrl.replace(getApiKey(), "***KEY***"),
    });

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // 1시간마다 재검증
    });

    if (!response.ok) {
      console.error("API 응답 실패:", response.status, response.statusText);
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    // XML 응답 파싱
    const xmlText = await response.text();
    const parsed: any = await parseXML(xmlText);

    console.log("📊 API 응답 (XML 파싱):", {
      resultCode: parsed?.response?.header?.[0]?.resultCode?.[0],
      resultMsg: parsed?.response?.header?.[0]?.resultMsg?.[0],
    });

    // API 응답 에러 체크
    const resultCode = parsed?.response?.header?.[0]?.resultCode?.[0];
    const resultMsg = parsed?.response?.header?.[0]?.resultMsg?.[0];

    // resultCode가 "00" 또는 "000"이면 성공
    if (resultCode !== "00" && resultCode !== "000") {
      console.error("API 에러:", resultCode, resultMsg);
      throw new Error(`API 에러 (${resultCode}): ${resultMsg}`);
    }

    // 데이터 변환
    const items = parsed?.response?.body?.[0]?.items?.[0]?.item || [];
    console.log(`📦 조회된 아이템 수: ${items.length}`);

    const result = items.map((item: any) => transformRealPriceDataFromXML(item));

    console.log(`✅ 실거래가 데이터 ${result.length}건 조회 완료`);
    return result;
  } catch (error) {
    console.error("❌ 실거래가 API 호출 에러:", error);
    return [];
  }
}

/**
 * 실거래가 데이터 변환 (XML 파싱 결과)
 */
function transformRealPriceDataFromXML(item: any): NearbyPriceData {
  // XML 파싱 시 모든 값이 배열로 들어옴
  const exclusiveArea = parseFloat(item.excluUseAr?.[0] || "0");
  const pyeong = Math.round(exclusiveArea / 3.3);
  const dealAmountStr = (item.dealAmount?.[0] || "").trim().replace(/,/g, "");
  const price = parseInt(dealAmountStr || "0", 10);

  const year = item.dealYear?.[0] || "";
  const month = (item.dealMonth?.[0] || "").padStart(2, "0");
  const day = (item.dealDay?.[0] || "").padStart(2, "0");

  return {
    apartmentName: item.aptNm?.[0] || "",
    address: `${item.umdNm?.[0] || ""} ${item.jibun?.[0] || ""}`,
    exclusiveArea: exclusiveArea,
    pyeong: pyeong,
    recentPrice: price,
    buildYear: item.buildYear?.[0] || "",
    floor: item.floor?.[0] || "",
    transactionDate: `${year}.${month}.${day}`,
  };
}

/**
 * 실거래가 데이터 변환 (JSON 응답용 - 사용 안 함)
 */
function transformRealPriceData(item: any): NearbyPriceData {
  const exclusiveArea = parseFloat(item.excluUseAr || "0");
  const pyeong = Math.round(exclusiveArea / 3.3);
  const price = parseInt(item.dealAmount?.replace(/,/g, "") || "0", 10);

  return {
    apartmentName: item.aptNm || "",
    address: `${item.umdNm} ${item.jibun}`,
    exclusiveArea: exclusiveArea,
    pyeong: pyeong,
    recentPrice: price,
    buildYear: item.buildYear || "",
    floor: item.floor || "",
    transactionDate: `${item.dealYear}.${item.dealMonth.padStart(2, "0")}.${item.dealDay.padStart(2, "0")}`,
  };
}

/**
 * 주소에서 지역코드 추출
 * 실제로는 행정구역코드 API를 사용하거나 매핑 테이블 필요
 */
function getRegionCode(address: string): string {
  // 시군구 코드 매핑 (행정표준코드관리시스템 법정동코드 5자리)
  const regionMap: { [key: string]: string } = {
    // 서울
    강남구: "11680",
    서초구: "11650",
    송파구: "11710",
    강동구: "11740",
    // 경기 - 용인시
    처인구: "41463",
    기흥구: "41461",
    수지구: "41465",
    용인시: "41460",
    // ... 더 많은 지역 추가 필요
  };

  // 주소에서 구 이름 추출 (상세한 지역부터 먼저 매칭)
  for (const [district, code] of Object.entries(regionMap)) {
    if (address.includes(district)) {
      return code;
    }
  }

  return "";
}

/**
 * 현재 년월 반환 (YYYYMM)
 */
function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}${month}`;
}

/**
 * N개월 전 년월 반환 (YYYYMM)
 * @param monthsAgo 몇 개월 전 (기본값: 2)
 */
function getPreviousYearMonth(monthsAgo: number = 2): string {
  const now = new Date();
  now.setMonth(now.getMonth() - monthsAgo);
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${year}${month}`;
}

/**
 * 특정 아파트의 최근 실거래가 조회
 * @param apartmentName 아파트명
 * @param address 주소
 * @returns 최근 실거래가 목록
 */
export async function getApartmentRecentPrice(
  apartmentName: string,
  address: string
): Promise<NearbyPriceData[]> {
  try {
    // 주변 실거래가 전체 조회
    const allPrices = await getNearbyRealPrice(address);

    // 해당 아파트만 필터링
    return allPrices.filter((item) => item.apartmentName.includes(apartmentName));
  } catch (error) {
    console.error("아파트 실거래가 조회 에러:", error);
    return [];
  }
}

/**
 * 평균 시세 계산
 * @param prices 실거래가 목록
 * @returns 평균 시세 (만원)
 */
export function calculateAveragePrice(prices: NearbyPriceData[]): number {
  if (prices.length === 0) return 0;

  const total = prices.reduce((sum, item) => sum + item.recentPrice, 0);
  return Math.round(total / prices.length);
}

/**
 * 평형별 최근 거래가 조회
 * @param prices 실거래가 목록
 * @param pyeong 평수
 * @returns 해당 평형의 최근 거래가
 */
export function getPriceByPyeong(
  prices: NearbyPriceData[],
  pyeong: number
): NearbyPriceData | null {
  // 정확히 일치하는 평형 찾기
  const exactMatch = prices.find((item) => item.pyeong === pyeong);
  if (exactMatch) return exactMatch;

  // 가장 가까운 평형 찾기
  const sorted = prices.sort((a, b) => {
    const diffA = Math.abs(a.pyeong - pyeong);
    const diffB = Math.abs(b.pyeong - pyeong);
    return diffA - diffB;
  });

  return sorted[0] || null;
}
